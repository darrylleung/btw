//REDUCER
export default function wallReducer(posts = [], action) {
    // reducer logic for messages
    if (action.type === "/posts/received") {
        posts = action.payload;
    } else if (action.type === "/posts/new") {
        console.log("payload: ", action.payload);
        posts = [action.payload, ...posts];
        // return messages;
    } 
    // else if (action.type === "/posts/delete") {
    //     posts = action.payload.filter(posts => posts - a)
    // }

    return posts;
}

//ACTIONS
export function receivedPosts(posts) {
    console.log("received posts on load: ", posts);
    return {
        type: "/posts/received",
        payload: posts,
    };
}

export function newPost(post) {
    console.log("what is in my new post: ", post);
    return {
        type: "/posts/new",
        payload: post,
    };
}

// export function deletePosts(posts) {
//     console.log("received instruction: ", posts);
//     return {
//         type: "/posts/delete",
//         payload: posts,
//     };
// }
