const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:postgres:postgres@localhost:5432/socialnetwork`
);

exports.checkExistingUser = (email) => {
    return db.query(
        `SELECT id
        FROM users
        WHERE email = $1`,
        [email]
    );
};

exports.registerNewUser = (first, last, email, hashedPassword) => {
    return db.query(
        `INSERT INTO users
        (firstname, lastname, email, password)
        VALUES ($1, $2, $3, $4)
        RETURNING id`,
        [first, last, email, hashedPassword]
    );
};

exports.login = (email) => {
    return db.query(
        `SELECT password, id
        FROM users
        WHERE email = $1`,
        [email]
    );
};

exports.reset = (email) => {
    return db.query(
        `SELECT email
        FROM users
        WHERE email = $1`,
        [email]
    );
};

exports.resetCode = (userEmail, secretCode) => {
    return db.query(
        `INSERT INTO reset_codes (email, code)
        VALUES ($1, $2)`,
        [userEmail, secretCode]
    );
};

exports.verifyCode = (code) => {
    return db.query(
        `SELECT code, email
        FROM reset_codes
        WHERE code = $1`,
        [code]
    );
};

exports.updatePassword = (hashedPassword, email) => {
    return db.query(
        `UPDATE users
        SET password = $1
        WHERE email = $2
        RETURNING id`,
        [hashedPassword, email]
    );
};

exports.getUserProfile = (userId) => {
    return db.query(
        `SELECT id, firstname, lastname, imageurl, bio, links
        FROM users
        WHERE id = $1`,
        [userId]
    );
};

exports.uploadProfilePic = (fullUrl, userId) => {
    return db.query(
        `UPDATE users
        SET imageurl = $1
        WHERE id = $2
        RETURNING imageurl`,
        [fullUrl, userId]
    );
};

exports.updateBio = (bio, userId) => {
    return db.query(
        `UPDATE users
        SET bio = $1
        WHERE id = $2
        RETURNING bio`,
        [bio, userId]
    );
};

exports.updateLink = (link, userId) => {
    return db.query(
        `UPDATE users
        SET links = $1
        WHERE id = $2
        RETURNING links`,
        [link, userId]
    );
};

exports.populateUsers = (userId) => {
    return db.query(
        `SELECT id, firstname, lastname, imageurl
        FROM users
        WHERE id <> $1
        ORDER BY id DESC
        LIMIT 5`,
        [userId]
    );
};

exports.findUsers = (searchTerm, userId) => {
    return db.query(
        `SELECT id, firstname, lastname, imageurl
        FROM users
        WHERE (firstname ILIKE $1 OR lastname ILIKE $1)
        AND (id <> $2)
        ORDER BY id DESC
        LIMIT 5`,
        [searchTerm + "%", userId]
    );
};

exports.getOtherProfile = (id) => {
    return db.query(
        `SELECT id, firstname, lastname, imageurl, bio, links
        FROM users
        WHERE id = $1`,
        [id]
    );
};

exports.getFriendshipStatus = (otherUserId, userId) => {
    return db.query(
        `SELECT * 
        FROM friendships
        WHERE (recipient_id = $1 AND sender_id = $2)
        OR (recipient_id = $2 AND sender_id = $1)
        `,
        [otherUserId, userId]
    );
};

exports.addFriend = (otherUserId, userId) => {
    return db.query(
        `INSERT INTO friendships
        (recipient_id, sender_id)
        VALUES ($1, $2)`,
        [otherUserId, userId]
    );
};

exports.acceptFriendRequest = (otherUserId, userId) => {
    return db.query(
        `UPDATE friendships
        SET accepted = true
        WHERE (recipient_id = $1 AND sender_id = $2)
        OR (recipient_id = $2 AND sender_id = $1)`,
        [otherUserId, userId]
    );
};

exports.unfriend = (otherUserId, userId) => {
    return db.query(
        `DELETE FROM friendships
        WHERE (recipient_id = $1 AND sender_id = $2)
        OR (recipient_id = $2 AND sender_id = $1)`,
        [otherUserId, userId]
    );
};

exports.retrieveFriends = (userId) => {
    return db.query(
        `SELECT users.id, users.firstname, users.lastname, users.imageurl, friendships.accepted
        FROM friendships
        JOIN users
        ON (friendships.accepted = false AND friendships.recipient_id = $1 AND friendships.sender_id = users.id)
        OR (friendships.accepted = true AND friendships.recipient_id = $1 AND friendships.sender_id = users.id)
        OR (friendships.accepted = true AND friendships.sender_id = $1 AND friendships.recipient_id = users.id)
        `,
        [userId]
    );
};

exports.retrieveMessages = () => {
    return db.query(
        `SELECT users.id, users.firstname, users.lastname, users.imageurl, global_chat.message, global_chat.created_at
        FROM global_chat
        JOIN users
        ON (global_chat.sender_id = users.id)
        ORDER BY global_chat.created_at DESC
        LIMIT 10
        `
    );
};

exports.storeMessage = (userId, message) => {
    return db.query(
        `INSERT INTO global_chat (sender_id, message)
        VALUES ($1, $2)`,
        [userId, message]
    );
};

exports.addPost = (post, userId) => {
    return db.query(
        `INSERT INTO wall (post, user_id)
        VALUES ($1, $2)
        RETURNING id, post, created_at`,
        [post, userId]
    );
};

exports.retrievePosts = (userId) => {
    return db.query(
        `SELECT post, created_at, id
        FROM wall
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT 10
        `,
        [userId]
    );
};

exports.deletePosts = (postId) => {
    return db.query(
        `DELETE FROM wall
        WHERE id = $1`,
        [postId]
    );
};

exports.retrieveOtherPosts = (otherUserId) => {
    return db.query(
        `SELECT post, created_at
        FROM wall
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT 10
        `,
        [otherUserId]
    );
};
