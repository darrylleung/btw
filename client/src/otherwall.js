import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { otherReceivedPosts } from "./redux/other-wall/slice";
import parse from "html-react-parser";

export function OtherWall({ otherUserId }) {
    const dispatch = useDispatch();

    const otherWallPosts = useSelector((state) => {
        return state.otherWallPosts;
    });

    useEffect(() => {
        (async () => {
            const res = await fetch("/posts/received/other", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ otherUserId }),
            });
            const data = await res.json();
            console.log("data: ", data);
            dispatch(otherReceivedPosts(data));
        })();
    }, []);

    return (
        <>
            <div className="wall">
                {otherWallPosts.map((posts, index) => {
                    return (
                        <div className="wallPostWrapper" key={index}>
                            <div className="post">{parse(posts.post)}</div>
                            <div className="postDetails">
                                {posts.created_at}
                            </div>
                        </div>
                    );
                })}
                <div className="wallPostEndBlock">No more posts. 🕳</div>
            </div>
        </>
    );
}
