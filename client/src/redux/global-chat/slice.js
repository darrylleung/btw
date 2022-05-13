//REDUCER
export default function globalChatReducer(messages = [], action) {
    // reducer logic for messages
    if (action.type === "/messages/received") {
        messages = action.payload;
    } else if (action.type === "/messages/new") {
        console.log("payload: ", action.payload[0]);
        messages = [action.payload[0], ...messages];
        // return messages;
    }

    return messages;
}

//ACTIONS
export function receivedMessages(messages) {
    console.log("received messages on load: ", messages);
    return {
        type: "/messages/received",
        payload: messages,
    };
}

export function newMessage(message) {
    console.log("what is in my new message: ", message);
    return {
        type: "/messages/new",
        payload: message,
    };
}
