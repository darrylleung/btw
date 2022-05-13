//REDUCER
export default function otherWallReducer(posts = [], action) {
    // reducer logic for messages
    if (action.type === "/posts/received/other") {
        posts = action.payload;
    }

    return posts;
}

//ACTIONS

export function otherReceivedPosts(posts) {
    console.log("received posts on load from other user: ", posts);
    return {
        type: "/posts/received/other",
        payload: posts,
    };
}
