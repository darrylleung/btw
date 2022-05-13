// import { useState, useEffect, useRef } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import DOMPurify from "dompurify";
import { useDispatch } from "react-redux";
import { newPost } from "./redux/wall/slice";
import MagicUrl from "quill-magic-url";

export function WritingComponent({ showWritingComponent }) {
    const dispatch = useDispatch();

    const { quill, quillRef, Quill } = useQuill({
        modules: {
            toolbar: "#toolbar",
            magicUrl: true,
        },
        formats: [
            "header",
            "font",
            "size",
            "bold",
            "italic",
            "underline",
            "align",
            "strike",
            "blockquote",
            "list",
            "bullet",
            "indent",
            "link",
            "image",
            "video",
            "color",
            "background",
        ],
        placeholder: "Write longform..."
    });

    if (Quill) {
        const Fonts = Quill.import("formats/font");
        Fonts.whitelist = ["Arizona", "ArizonaThin", "Diatype"];
        Quill.register(Fonts, true);
        Quill.register("modules/magicUrl", MagicUrl);
    }

    const handleBlogSubmit = () => {
        // console.log("What I am submitting: ", quill.root.innerHtml());
        // console.log("get text only: ", quill.getText());
        // console.log("innerHtml using quill: ", quill.root.innerHTML);
        let postForDb = {};
        postForDb.post = DOMPurify.sanitize(
            quill.root.innerHTML.replaceAll("<p><br></p>", "")
        );
        console.log("what I am submitting:", postForDb);

        fetch("/posts/new", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(postForDb),
        })
            .then((res) => res.json())
            .then((data) => {
                dispatch(newPost(data));
                showWritingComponent();
            })
            .catch((err) => console.log("err: ", err));
    };

    return (
        <>
            <div className="writingComponent">
                <div id="toolbar">
                    <span className="ql-formats">
                        <select className="ql-font" defaultValue="Arizona">
                            <option value="Arizona">Arizona</option>
                            <option value="ArizonaThin">Arizona Thin</option>
                            <option value="Diatype">Diatype</option>
                        </select>
                        <select className="ql-header" defaultValue="3">
                            <option value="1">Heading</option>
                            <option value="2">Subheading</option>
                            <option value="3">Normal</option>
                        </select>
                    </span>
                    <span className="ql-formats">
                        <button className="ql-bold" />
                        <button className="ql-italic" />
                        <button className="ql-underline" />
                        <button className="ql-strike" />
                    </span>
                    <span className="ql-formats">
                        <button className="ql-list" value="ordered" />
                        <button className="ql-list" value="bullet" />
                        <button className="ql-indent" value="-1" />
                        <button className="ql-indent" value="+1" />
                    </span>
                    <span className="ql-formats">
                        <button className="ql-blockquote" />
                        <select className="ql-align" />
                        <select className="ql-color" />
                        <select className="ql-background" />
                    </span>
                    <span className="ql-formats">
                        <button className="ql-image" />
                    </span>
                    <span className="ql-formats">
                        <button className="ql-clean" />
                    </span>
                </div>
                <div ref={quillRef} />
            </div>
            <button className="submit" onClick={handleBlogSubmit}>
                Submit
            </button>
        </>
    );
}
