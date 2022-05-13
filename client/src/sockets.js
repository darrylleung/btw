import { io } from "socket.io-client";
import { receivedMessages } from "./redux/global-chat/slice";
import { newMessage } from "./redux/global-chat/slice";

export let socket;

export const init = (store) => {
    if (!socket) {
        console.log("initialize connection");
        socket = io.connect();

        // 1. save last 10 messages to the store
        socket.on("last-10-messages", (data) => {
            console.log("data last-10-messages: ", data);

            store.dispatch(receivedMessages(data.messages));
        });

        // 2. save new incoming messages to the store
        socket.on("message-broadcast", (data) => {
            console.log("data message-broadcast: ", data);
            store.dispatch(newMessage(data));
        });
    }
};
