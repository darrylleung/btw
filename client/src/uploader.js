import { useState } from "react";

export function Uploader({ setProfilePic, uploaderIsVisible, setUploaderText, uploaderText}) {
    const [file, setFile] = useState();
    // const [uploaderText, setUploaderText] = useState(
    //     "Choose a Profile Picture"
    // );
    // const [uploaderInputText, setUploaderInputText] = useState();

    const clickHandler = () => {
        const fd = new FormData();
        fd.append("file", file);
        console.log("file selected: ", file);

        fetch("/upload", {
            method: "POST",
            body: fd,
        })
            .then((res) => res.json())
            .then(({ imageurl }) => {
                console.log("Response: ", imageurl);
                setProfilePic(imageurl);
            })
            .catch((err) => {
                console.log("error submitting form fields: ", err);
            });
    };

    const uploadHandler = (e) => {
        let fileSize = e.target.files[0].size;
        let newFile = e.target.files[0];
        if (fileSize > 3000000) {
            setUploaderText("Image exceeds size limit!");
            return;
        } else {
            fileSelectHandler(newFile);
        }
    };

    const fileSelectHandler = (newFile) => {
        setUploaderText("Image selected!");
        console.log("file selected: ", file);
        setFile(newFile);
        console.log("File stored in state: ", file);
    };

    return (
        <>
            <div
                className={`uploader ${
                    uploaderIsVisible ? "showUploader" : "removeUploader"
                }`}
            >
                {/* <h2>Upload a new profile picture.</h2>
                {uploaderText && <h2>{uploaderText}</h2>} */}
                <input
                    onChange={uploadHandler}
                    type="file"
                    name="file"
                    accept="image/*"
                    id="file"
                    className="inputFile"
                />
                <label htmlFor="file">{uploaderText}</label>
                <button onClick={clickHandler} className="submit">
                    Submit
                </button>
            </div>
        </>
    );
}
