import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { receivedPosts } from "./redux/wall/slice";
import parse from "html-react-parser";

export function Wall() {
    const dispatch = useDispatch();
    const [status, setStatus] = useState(false);

    const wallPosts = useSelector((state) => {
        return state.wallPosts;
    });

    console.log("Wall posts: ", wallPosts);

    useEffect(() => {
        (async () => {
            const res = await fetch("/posts/received");
            const data = await res.json();
            console.log("data: ", data);
            wallExists(data);
            dispatch(receivedPosts(data));
        })();
    }, []);

    const wallExists = (data) => {
        if (data.length < 1) {
            setStatus(false);
        } else {
            setStatus(true);
        }
    };

    // const deletePost = (e) => {
    //     const id = e.target.id;
    //     console.log("id: ", id);
    //     async () => {
    //         const res = await fetch("/posts/delete");
    //         const data = await res.json();
    //         console.log("data: ", data);
    //         dispatch(deletePosts(data));
    //     };
    // };

    return (
        <div className={`wallContainer ${!status ? "wallBlock" : null}`}>
            {status && (
                <div className="wall">
                    {wallPosts.map((posts, index) => {
                        return (
                            <div className="wallPostWrapper" key={index}>
                                <div className="post">{parse(posts.post)}</div>
                                <div className="postDetails">
                                    {posts.created_at}
                                </div>
                                {/* <button
                            id={posts.id}
                            className="unfriend"
                            onClick={deletePost}
                        >
                            Delete
                        </button> */}
                            </div>
                        );
                    })}
                    <div className="wallPostEndBlock">No more posts. 🕳</div>
                </div>
            )}
            {!status && (
                <div>
                    To begin a new post, click on the button at the bottom
                    right. 🌝
                </div>
            )}
        </div>
    );
}
