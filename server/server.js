const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(
            null,
            req.headers.referer.startsWith(process.env.NODE_ENV == "production" ? "https://b-t-w.herokuapp.com" : "http://localhost:3000")
        ),
});
const cookieSession = require("cookie-session");
const { compare, hash } = require("./bc");
const db = require("./db");
const { sendEmail } = require("./ses");
const cryptoRandomString = require("crypto-random-string");
// const secretCode = cryptoRandomString({
//     length: 6,
// });
const { uploader } = require("./upload");
const s3 = require("./s3");
const { DateTime } = require("luxon");

app.use(compression());
app.use(
    express.json({
        limit: "5mb",
    })
);

let sessionSecret;
if (process.env.NODE_ENV == "production") {
    sessionSecret = process.env.SESSION_SECRET;
} else {
    sessionSecret = require("../secrets.json").SESSION_SECRET;
}

const cookieSessionMiddleware = cookieSession({
    secret: sessionSecret,
    maxAge: 1000 * 60 * 60 * 24 * 90, //maxAge in milliseconds
    sameSite: true,
});

app.use(cookieSessionMiddleware);

io.use((socket, next) => {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.get("/user/id", (req, res) => {
    res.json({
        userId: req.session.userId,
    });
});

app.post("/register/check", (req, res) => {
    console.log("req.body: ", req.body);
    const { email } = req.body;

    db.checkExistingUser(email)
        .then(({ rows }) => {
            if (rows[0] == undefined) {
                res.json({ success: true });
            } else {
                res.json({ success: false });
            }
        })
        .catch((err) => {
            console.log("Error: ", err);
            res.json({ success: false });
        });
});

app.post("/register", (req, res) => {
    console.log("req.body: ", req.body);
    const { first, last, email, password, password2 } = req.body;

    if (password != password2) {
        console.log("Passwords did not match");
        res.json({ success: false });
    } else {
        hash(password).then((hashedPassword) => {
            db.registerNewUser(first, last, email, hashedPassword)
                .then(({ rows }) => {
                    let userId = rows[0].id;
                    req.session.userId = userId;
                    res.json({ success: true });
                })
                .catch((err) => {
                    console.log("err: ", err);
                    res.json({ success: false });
                });
        });
    }
});

app.post("/login", (req, res) => {
    console.log("req.body: ", req.body);
    const { email, password } = req.body;

    db.login(email)
        .then(({ rows }) => {
            console.log("Result from login: ", rows);
            let hashedPassword = rows[0].password;
            let userId = rows[0].id;
            compare(password, hashedPassword)
                .then((match) => {
                    console.log(
                        "Does the password match the one stored: ",
                        match
                    );

                    if (match) {
                        req.session.userId = userId;
                        res.json({ success: true });
                    } else {
                        res.json({ success: false });
                    }
                })
                .catch((err) => {
                    console.log("err: ", err);
                    res.json({ success: false });
                });
        })
        .catch((err) => {
            console.log("err: ", err);
            res.json({ success: false });
        });
});

app.post("/reset/start", (req, res) => {
    console.log("req.body: ", req.body);
    const { email } = req.body;

    db.reset(email)
        .then(({ rows }) => {
            console.log("Result from reset: ", rows);
            let userEmail = rows[0].email;

            if (userEmail.length > 0) {
                console.log("User email matches!");

                const secretCode = cryptoRandomString({
                    length: 6,
                });

                db.resetCode(userEmail, secretCode)
                    .then((result) => {
                        console.log("Reset code stored in db: ", result);
                        const message = `Your reset code is: ${secretCode}`;
                        const subject = `Your reset code is: ${secretCode}`;
                        sendEmail(userEmail, message, subject);
                        res.json({ success: true });
                    })
                    .catch((err) => {
                        console.log("err: ", err);
                    });
            } else {
                console.log("No match");
                res.json({ success: false });
            }
        })
        .catch((err) => {
            console.log("err", err);
            res.json({ success: false });
        });
});

app.post("/reset/verify", (req, res) => {
    console.log("req.body: ", req.body);
    const { otp, password } = req.body;

    db.verifyCode(otp)
        .then(({ rows }) => {
            console.log("Result from reset: ", rows);
            let secretCode = rows[0].code;
            let email = rows[0].email;

            if (secretCode.length > 0) {
                console.log("Secret code matches!");
                hash(password)
                    .then((hashedPassword) => {
                        db.updatePassword(hashedPassword, email)
                            .then(({ rows }) => {
                                console.log("Result from update: ", rows);
                                res.json({ verified: true });
                            })
                            .catch((err) => {
                                console.log("err", err);
                                res.json({ verified: false });
                            });
                    })
                    .catch((err) => {
                        console.log("err: ", err);
                        res.json({ verified: false });
                    });
            } else {
                console.log("Verification failed.");
                res.json({ verified: false });
            }
        })
        .catch((err) => {
            console.log("err", err);
            res.json({ verified: false });
        });
});

app.get("/user", (req, res) => {
    const { userId } = req.session;
    db.getUserProfile(userId)
        .then(({ rows }) => {
            // console.log("user data: ", rows[0]);
            res.json(rows[0]);
        })
        .catch((err) => console.log("err: ", err));
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("req.file: ", req.file);
    const { filename } = req.file;
    const { userId } = req.session;
    const fullUrl = "https://darryl-bucket-1.s3.amazonaws.com/" + filename;
    console.log("fullUrl: ", fullUrl);

    db.uploadProfilePic(fullUrl, userId)
        .then(({ rows }) => {
            let imageurl = rows[0];
            res.json(imageurl);
        })
        .catch((err) => console.log("err: ", err));
});

app.post("/user/updatebio", (req, res) => {
    console.log("req.body: ", req.body);
    const { bio } = req.body;
    const { userId } = req.session;
    db.updateBio(bio, userId)
        .then(({ rows }) => {
            let bio = rows[0];
            res.json(bio);
        })
        .catch((err) => console.log("err: ", err));
});

app.post("/user/updatelinks", (req, res) => {
    console.log("link:", req.body.link);
    let { link } = req.body;
    const { userId } = req.session;

    if (link == "") {
        link = "";
    } else if (!link.startsWith("http" || "https")) {
        link = "https://" + link;
        console.log("new link: ", link);
    }

    db.updateLink(link, userId)
        .then(({ rows }) => {
            console.log("rows received from updatelinks: ", rows);
            let links = rows[0];
            res.json(links);
        })
        .catch((err) => console.log("err: ", err));
});

app.get("/users", (req, res) => {
    console.log("req.query.search: ", req.query.search);
    let searchTerm = req.query.search;
    const { userId } = req.session;

    if (!searchTerm) {
        db.populateUsers(userId)
            .then(({ rows }) => {
                console.log("Search results: ", rows);
                res.json(rows);
            })
            .catch((err) => console.log("err: ", err));
    } else {
        db.findUsers(searchTerm, userId)
            .then(({ rows }) => {
                console.log("Search results: ", rows);
                res.json(rows);
            })
            .catch((err) => console.log("err: ", err));
    }
});

app.get("/api/user/:id", (req, res) => {
    console.log("requested user: ", req.params);
    const { id } = req.params;
    db.getOtherProfile(id)
        .then(({ rows }) => {
            console.log("Results: ", rows[0]);
            res.json(rows[0]);
        })
        .catch((err) => console.log("err: ", err));
});

app.get("/friendship-status/:otherUserId", (req, res) => {
    console.log("get friendship status of userId: ", req.params);
    const { otherUserId } = req.params;
    const { userId } = req.session;

    db.getFriendshipStatus(otherUserId, userId)
        .then(({ rows }) => {
            console.log("response from Friendship table: ", rows[0]);
            !rows[0] ? res.json({ success: false }) : res.json(rows[0]);
        })
        .catch((err) => console.log("err: ", err));
});

// FRIENDSHIP BUTTON
const FRIENDSHIP_ACTIONS = {
    MAKE_FRIENDSHIP: "Add Friend",
    ACCEPT_FRIENDSHIP: "Accept Request",
    CANCEL_FRIENDSHIP: "Cancel Request",
    UNFRIEND: "Unfriend",
};

app.post("/friendship", (req, res) => {
    console.log("what i'm sending to the server: ", req.body);
    const { otherUserId, buttonText } = req.body;
    const { userId } = req.session;

    if (buttonText === FRIENDSHIP_ACTIONS.MAKE_FRIENDSHIP) {
        db.addFriend(otherUserId, userId)
            .then(() =>
                res.json({
                    success: true,
                })
            )
            .catch((err) => console.log("err: ", err));
    } else if (buttonText === FRIENDSHIP_ACTIONS.ACCEPT_FRIENDSHIP) {
        db.acceptFriendRequest(otherUserId, userId)
            .then(() =>
                res.json({
                    success: true,
                })
            )
            .catch((err) => console.log("err: ", err));
    } else if (buttonText === FRIENDSHIP_ACTIONS.CANCEL_FRIENDSHIP) {
        db.unfriend(otherUserId, userId)
            .then(() =>
                res.json({
                    success: false,
                })
            )
            .catch((err) => console.log("err: ", err));
    } else {
        db.unfriend(otherUserId, userId)
            .then(() =>
                res.json({
                    success: false,
                })
            )
            .catch((err) => console.log("err: ", err));
    }
});

app.get("/friendship/all", (req, res) => {
    const { userId } = req.session;

    db.retrieveFriends(userId)
        .then(({ rows }) => {
            console.log("Friends: ", rows);
            res.json(rows);
        })
        .catch((err) => console.log("err: ", err));
});

app.post("/friendship/accept", (req, res) => {
    console.log("what I'm sending to the server: ", req.body);
    const { otherUserId } = req.body;
    const { userId } = req.session;

    db.acceptFriendRequest(otherUserId, userId)
        .then(() =>
            res.json({
                success: true,
            })
        )
        .catch((err) => console.log("err: ", err));
});

app.post("/friendship/unfriend", (req, res) => {
    console.log("what I'm sending to the server: ", req.body);
    const { otherUserId } = req.body;
    const { userId } = req.session;

    db.unfriend(otherUserId, userId)
        .then(() =>
            res.json({
                success: false,
            })
        )
        .catch((err) => console.log("err: ", err));
});

// Wall Component

app.post("/posts/new", (req, res) => {
    console.log("What I'm sending to the server: ", req.body);
    const { post } = req.body;
    const { userId } = req.session;

    db.addPost(post, userId)
        .then(({ rows }) => {
            console.log("What I am getting back from the server: ", rows[0]);
            let newDate = DateTime.fromJSDate(rows[0].created_at);
            rows[0].created_at = newDate.toLocaleString(DateTime.DATETIME_MED);

            res.json(rows[0]);
        })
        .catch(() => {
            console.log("Failed to add post");
            res.json({ success: false });
        });
});

// app.post("/posts/delete", (req, res) => {
//     console.log("What I'm sending to the server: ", req.body);
//     const postId = req.body.id;
//     // const { userId } = req.session;

//     db.deletePost(postId)
//         .then(() => {
//             console.log("server listened");
//             res.json({success: true});
//         })
//         .catch(() => {
//             console.log("Failed to delete post");
//             res.json({ success: false });
//         });
// });

app.get("/posts/received", (req, res) => {
    const { userId } = req.session;

    db.retrievePosts(userId)
        .then(({ rows }) => {
            console.log("Posts received ", rows);
            for (let i = 0; i < rows.length; i++) {
                let newDate = DateTime.fromJSDate(rows[i].created_at);
                rows[i].created_at = newDate.toLocaleString(
                    DateTime.DATETIME_MED
                );
            }
            res.json(rows);
        })
        .catch((err) => console.log("err: ", err));
});

app.post("/posts/received/other", (req, res) => {
    const { otherUserId } = req.body;
    // const { userId } = req.session;

    db.retrieveOtherPosts(otherUserId)
        .then(({ rows }) => {
            console.log("Posts received ", rows);
            for (let i = 0; i < rows.length; i++) {
                let newDate = DateTime.fromJSDate(rows[i].created_at);
                rows[i].created_at = newDate.toLocaleString(
                    DateTime.DATETIME_MED
                );
            }
            res.json(rows);
        })
        .catch((err) => console.log("err: ", err));
});

app.post("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});

//this is the last route, all data routes need to come beforehand
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});

io.on("connection", (socket) => {
    console.log("New Connection!");
    const userId = socket.request.session.userId;
    console.log("userId: ", userId);

    if (userId) {
        // 1. send last 10 messages
        // 1-a. retrieve last 10 messages from the db
        // 1-b. emit those messages
        db.retrieveMessages()
            .then(({ rows }) => {
                console.log("Data received: ", rows);
                socket.emit("last-10-messages", {
                    messages: rows,
                });
            })
            .catch((err) => console.log("err: ", err));

        // 2. broadcast new incoming messages
        //listen to "message-broadcast", dispatch an action to update the store
        socket.on("message", (message) => {
            console.log("Message sent: ", message);
            Promise.all([
                db.storeMessage(userId, message),
                db.getUserProfile(userId),
            ])
                .then((data) => {
                    // console.log("Message received back: ", message.rows[0]);
                    console.log(
                        "User information received back: ",
                        data[1].rows
                    );
                    let newMessage = [];
                    let newMessageObj = data[1].rows[0];
                    newMessageObj.message = message;
                    newMessage.push(newMessageObj);
                    console.log("Data file to send: ", newMessage);

                    io.emit("message-broadcast", newMessage);
                })
                .catch((err) => console.log("err: ", err));
            //store message to the db, make sure you retrieve the connected user data, broadcast message to everyone
        });
    } else {
        console.log("User has disconnected: ", userId);
        return socket.disconnect(true);
    }
});
