import { BrowserRouter, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ProfilePic } from "./profilepic";
import { Uploader } from "./uploader";
import { Profile } from "./profile";
import { FindUsers } from "./findusers";
import { OtherProfile } from "./otherprofile";
import { FriendsAndWannabees } from "./friends-wannabees";

export function App() {
    const [user, setUser] = useState({});
    const [uploaderIsVisible, setShowUploader] = useState(false);
    const [imageurl, setImageurl] = useState();
    const [newBio, setBio] = useState();
    const [newLinks, setLinks] = useState();
    const [uploaderText, setUploaderText] = useState(
        "Choose a Profile Picture"
    );
    const[overlay, setOverlay] = useState(false);

    useEffect(() => {
        fetch("/user")
            .then((res) => res.json())
            .then((data) => {
                console.log("user data: ", data);
                setUser(data);
            })
            .catch((err) => console.log("err: ", err));
    }, [imageurl, newBio, newLinks]);

    const showUploader = () => {
        if (!uploaderIsVisible) {
            setShowUploader(true);
        } else {
            setShowUploader(false);
        }
    };

    const showOverlay = () => {
        if (!overlay) {
            setOverlay(true);
        } else {
            setOverlay(false);
        }
    };

    const closeUploader = () => {
        setShowUploader(false);
        setUploaderText("Choose a Profile Picture");
    };

    const setProfilePic = (imageurl) => {
        setImageurl(imageurl);
        setShowUploader(false);
    };

    const setNewBio = (newBio) => {
        setBio(newBio);
    };

    const setNewLinks = (newLinks) => {
        setLinks(newLinks);
    };

    if (!user.id) {
        return <img src="/images/404.png" alt="404" />;
    }

    return (
        <>
            <div className="appContainer">
                <BrowserRouter>
                    <div className="header">
                        <div className="header-left">
                            <Link to="/">
                                <span className="logo">btw</span>
                            </Link>
                        </div>
                        <div className="header-right">
                            <div className="nav">
                                <form method="post" action="/logout">
                                    <button className="logout">Log Out</button>
                                </form>
                            </div>
                            <div className="nav">
                                <Link to="/friends" className="friends">
                                    Friends
                                </Link>
                            </div>
                            <div className="profilePic">
                                <ProfilePic
                                    imageurl={user.imageurl}
                                    firstname={user.firstname}
                                    lastname={user.lastname}
                                />
                            </div>
                        </div>
                    </div>

                    <Uploader
                        setProfilePic={setProfilePic}
                        uploaderIsVisible={uploaderIsVisible}
                        setUploaderText={setUploaderText}
                        uploaderText={uploaderText}
                    />
                    {uploaderIsVisible && (
                        <div className="overlay" onClick={closeUploader} />
                    )}
                    {overlay && (
                        <div className="overlay" onClick={showOverlay} />
                    )}

                    <Route exact path="/">
                        <Profile
                            firstname={user.firstname}
                            lastname={user.lastname}
                            imageurl={user.imageurl}
                            showUploader={showUploader}
                            bio={user.bio}
                            links={user.links}
                            setNewBio={setNewBio}
                            setNewLinks={setNewLinks}
                            showOverlay={showOverlay}
                        />
                    </Route>
                    <Route path="/findusers">
                        <FindUsers />
                    </Route>
                    <Route exact path="/user/:id">
                        <OtherProfile id={user.id} />
                    </Route>
                    <Route path="/friends">
                        <FriendsAndWannabees />
                    </Route>
                </BrowserRouter>
            </div>
        </>
    );
}
