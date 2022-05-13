import { useSelector } from "react-redux";
import { useState, useRef, Fragment } from "react";
import { socket } from "./sockets";
import { Link } from "react-router-dom";

export function Chat({ userId }) {
    const [message, setMessage] = useState();

    const chatContainer = useRef();

    const globalChatMessages = useSelector((state) => {
        return state.globalChat;
    });

    const sendMessage = (e) => {
        e.preventDefault();
        console.log("Message: ", message);
        socket.emit("message", message);
        setMessage("");
    };

    const handleChange = ({ target }) => {
        setMessage(target.value);
    };

    return (
        <section className="globalChat">
            <section ref={chatContainer} className="messageContainer">
                {globalChatMessages.map((messages, index) => {
                    return (
                        <Fragment key={index}>
                            <div className="messageWrap">
                                <div className="messageSender">
                                    <Link to={`/user/${messages.id}`}>
                                        <img
                                            className="profilePic"
                                            src={
                                                messages.imageurl ||
                                                "/images/default.png"
                                            }
                                            alt={`${messages.firstname} ${messages.lastname}`}
                                        />
                                    </Link>
                                    <span className="messageSender">
                                        {messages.firstname} {messages.lastname}
                                    </span>
                                </div>
                                <div className="messageText">
                                    {messages.message}
                                </div>
                            </div>
                        </Fragment>
                    );
                })}
            </section>
            <div className="globalChatInputContainer">
                <textarea
                    value={message}
                    name="message"
                    className="messageInput"
                    placeholder={"Send a quip..."}
                    onChange={handleChange}
                ></textarea>
                <button className="submit" onClick={sendMessage}>
                    Submit
                </button>
            </div>
        </section>
    );
}
