import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { FriendButton } from "./friendbutton";
import { Textfit } from "react-textfit";
import { OtherWall } from "./otherwall";

export function OtherProfile({ id }) {
    const params = useParams();
    const history = useHistory();
    const [user, setUser] = useState({});
    const [logo, setLogo] = useState();
    const [status, setStatus] = useState(false);

    useEffect(() => {
        fetch(`/api/user/${params.id}`)
            .then((res) => res.json())
            .then((data) => {
                console.log("data received: ", data);
                const { links } = data;
                if (params.id == id) {
                    history.replace("/");
                } else {
                    setUser(data);
                    const str = links;
                    const instagram = "instagram.com";
                    const fb = "facebook.com";
                    const twitter = "twitter.com";
                    const tiktok = "tiktok.com";
                    const github = "github.com";
                    // const empty = "https://";

                    if (!str) {
                        setLogo(false);
                    } else if (str.includes(instagram)) {
                        setLogo("/images/instagram.png");
                    } else if (str.includes(fb)) {
                        setLogo("/images/facebook.png");
                    } else if (str.includes(twitter)) {
                        setLogo("/images/twitter.png");
                    } else if (str.includes(tiktok)) {
                        setLogo("/images/tiktok.png");
                    } else if (str.includes(github)) {
                        setLogo("/images/github.png");
                    } else {
                        setLogo("/images/link.png");
                    }
                }
            })
            .catch((err) => console.log("err: ", err));
    }, []);

    useEffect(() => {
        fetch(`/friendship-status/${params.id}`)
            .then((res) => res.json())
            .then((data) => {
                console.log("data fetched from friendship status: ", data);
                const { accepted } = data;
                if (!accepted) {
                    setStatus(false);
                } else {
                    setStatus(true);
                }
            });
    }, []);

    const { firstname, lastname, imageurl, bio, links } = user;

    return (
        <div className="profileContainer">
            <div className="app-left">
                <div className="bioContainer">
                    <div className="profilePicContainer">
                        <img
                            className="profilePic"
                            src={imageurl || "/images/default.png"}
                            alt={`${firstname} ${lastname}`}
                        />
                    </div>
                    <div className="bioTextContainer">
                        <Textfit
                            className="bioText"
                            mode="single"
                            min={24}
                            max={48}
                        >
                            <span className="username">
                                {firstname} {lastname}
                            </span>
                        </Textfit>
                        <div className="other-profile-bioContainer">
                            <div className="bio">{bio}</div>
                            {logo && (
                                <a
                                    href={links}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <img className="linkLogo" src={logo} />
                                </a>
                            )}
                            <FriendButton otherUserId={params.id} userId={id} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="app-right">
                <div className={`wallContainer ${!status ? 'wallBlock' : null}`}>
                    {status && <OtherWall otherUserId={params.id} />}
                    {!status && <div>Add Friend to Read Their Posts! 🔏</div>}
                </div>
            </div>
        </div>
    );
}
