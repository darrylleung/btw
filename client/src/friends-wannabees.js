import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
    receiveFriendsAndWannabees,
    acceptFriend,
    unfriend,
} from "./redux/friends-wannabees/slice";
import { FindUsers } from "./findusers";

export function FriendsAndWannabees() {
    const dispatch = useDispatch();

    const wannabees = useSelector(
        (state) =>
            state.friendsWannabees &&
            state.friendsWannabees.filter((friendship) => !friendship.accepted)
    );

    console.log("wannabees: ", wannabees);

    const friends = useSelector(
        (state) =>
            state.friendsWannabees &&
            state.friendsWannabees.filter((friendship) => friendship.accepted)
    );

    console.log("friends: ", friends);

    //when component mounts, get all friends and wannabees

    useEffect(() => {
        (async () => {
            const res = await fetch("/friendship/all");
            const data = await res.json();
            dispatch(receiveFriendsAndWannabees(data));
        })();
    }, []);

    const handleAccept = async (id) => {
        const res = await fetch("/friendship/accept", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ otherUserId: id }),
        });
        const data = await res.json();
        console.log("data received: ", data);
        const { success } = data;
        if (success) {
            dispatch(acceptFriend(id));
        }
    };

    const handleUnfriend = async (id) => {
        const res = await fetch("/friendship/unfriend", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ otherUserId: id }),
        });
        const data = await res.json();
        console.log("data received: ", data);
        const { success } = data;
        if (!success) {
            dispatch(unfriend(id));
        }
    };

    return (
        <div className="friendsContainer">
            <FindUsers />
            <div className="friends">
                <span className="title">Friends</span>
                <div className="friendsResultContainer">
                    {friends.map((friend) => {
                        return (
                            <div className="searchResult" key={friend.id}>
                                <Link to={`/user/${friend.id}`}>
                                    <img
                                        className="profilePic"
                                        src={
                                            friend.imageurl ||
                                            "/images/default.png"
                                        }
                                    />
                                    <div className="searchResultNames">
                                        {friend.firstname} {friend.lastname}
                                    </div>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="requests">
                <span className="title">Requests</span>
                <div className="requestResultContainer">
                    {wannabees.map((wannabee) => {
                        return (
                            <div className="searchResult" key={wannabee.id}>
                                <Link to={`/user/${wannabee.id}`}>
                                    <img
                                        className="profilePic"
                                        src={
                                            wannabee.imageurl ||
                                            "/images/default.png"
                                        }
                                    />
                                    <div className="searchResultNames">
                                        {wannabee.firstname} {wannabee.lastname}
                                    </div>
                                </Link>
                                <div className="buttonBar">
                                    <button
                                        className="addFriend"
                                        onClick={() =>
                                            handleAccept(wannabee.id)
                                        }
                                    >
                                        ✓
                                    </button>
                                    <button
                                        className="unfriend"
                                        onClick={() =>
                                            handleUnfriend(wannabee.id)
                                        }
                                    >
                                        ❌
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
