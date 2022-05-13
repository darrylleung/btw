import { useEffect, useState } from "react";

export function FriendButton({ otherUserId, userId }) {
    const [buttonText, setButtonText] = useState();
    const [style, setStyle] = useState();

    console.log("prop received from otherprofile: ", otherUserId);

    useEffect(() => {
        fetch(`/friendship-status/${otherUserId}`)
            .then((res) => res.json())
            .then((data) => {
                console.log("data fetched from friendship status: ", data);
                const { success, sender_id, accepted } = data;
                if (accepted === false) {
                    if (sender_id === userId) {
                        setButtonText("Cancel Request");
                        setStyle("pending");
                    } else {
                        setButtonText("Accept Request");
                        setStyle("pending");
                    }
                } else if (success === false) {
                    setButtonText("Add Friend");
                    setStyle("addFriend");
                } else {
                    setButtonText("Unfriend");
                    setStyle("unfriend");
                }
            });
    }, []);


    const handleClick = () => {
        fetch("/friendship", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ otherUserId, buttonText }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("response from the server: ", data);
                const { success, sender_id, accepted } = data;
                if (accepted === false) {
                    if (sender_id === userId) {
                        setButtonText("Cancel Request");
                        setStyle("pending");
                    } else {
                        setButtonText("Accept Request");
                        setStyle("pending");
                    }
                } else if (success === false) {
                    setButtonText("Add Friend");
                    setStyle("addFriend");
                } else {
                    setButtonText("Cancel Request");
                    setStyle("pending");
                }
            });
    };

    return (
        <button className={style} onClick={handleClick}>
            {buttonText}
        </button>
    );
}
