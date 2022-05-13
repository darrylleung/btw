import { useState } from "react";
import { useForm } from ".//hooks/handle-form";

export function BioEditor({ bio, setNewBio, links, setNewLinks }) {
    const [values, handleChange] = useForm();
    const [textArea, setShowTextArea] = useState(false);
    const [linkArea, setShowLinkArea] = useState(false);

    const showTextArea = () => {
        if (!textArea) {
            setShowTextArea(true);
        } else {
            setShowTextArea(false);
        }
    };

    const showLinkArea = () => {
        if (!linkArea) {
            setShowLinkArea(true);
        } else {
            setShowLinkArea(false);
        }
    };

    const handleBioSubmit = (e) => {
        console.log("values: ", values);
        if (values) {
            const { bio } = values;
            console.log("New bio user is submitting: ", bio);
            fetch("/user/updatebio", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ bio }),
            })
                .then((res) => res.json())
                .then(({ bio }) => {
                    console.log(
                        "Response from posting to /user/updatebio: ",
                        bio
                    );
                    setNewBio(bio);
                    setShowTextArea(false);
                })
                .catch((err) => {
                    console.log("err on posting /user/updatebio: ", err);
                });
        } else {
            e.preventDefault();
            setShowTextArea(false);
        }
    };

    const handleLinkSubmit = (e) => {
        console.log("values: ", values);
        if (values) {
            const { link } = values;
            console.log("New link user is submitting: ", link);
            fetch("/user/updatelinks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ link }),
            })
                .then((res) => res.json())
                .then(({ links }) => {
                    console.log(
                        "Response from posting to /user/updatelinks: ",
                        links
                    );
                    setNewLinks(links);
                    setShowLinkArea(false);
                })
                .catch((err) => {
                    console.log("err on posting /user/updatelinks: ", err);
                });
        } else {
            e.preventDefault();
            setShowLinkArea(false);
        }
    };

    if (!bio && !links) {
        return (
            <>
                <div className="bioEditor">
                    <button className="bioSubmit" onClick={showTextArea}>
                        Add bio
                    </button>
                    <button className="linkSubmit" onClick={showLinkArea}>
                        Add link
                    </button>
                    {textArea && (
                        <div className="edit">
                            <textarea
                                className="bioEditor"
                                maxLength={35}
                                name="bio"
                                onChange={handleChange}
                                placeholder="Please add a new bio"
                            />
                            <button
                                className="bioSubmit"
                                onClick={handleBioSubmit}
                            >
                                Save
                            </button>
                        </div>
                    )}
                    {linkArea && (
                        <div className="link-edit-no-bio">
                            <input
                                className="linkEditor"
                                name="link"
                                autoComplete="off"
                                onChange={handleChange}
                                placeholder="Add a link"
                            />
                            <button
                                className="bioSubmit"
                                onClick={handleLinkSubmit}
                            >
                                Save
                            </button>
                        </div>
                    )}
                </div>
            </>
        );
    } else if (!links) {
        return (
            <>
                <div className="bioEditor">
                    <div className="bio" onClick={showTextArea}>
                        {bio}
                    </div>
                    <button className="bioSubmit" onClick={showTextArea}>
                        Edit
                    </button>
                    <button className="linkSubmit" onClick={showLinkArea}>
                        Add link
                    </button>

                    {textArea && (
                        <div className="edit">
                            <textarea
                                className="bioEditor"
                                maxLength={35}
                                name="bio"
                                onChange={handleChange}
                                placeholder={bio}
                            />
                            <button
                                className="bioSubmit"
                                onClick={handleBioSubmit}
                            >
                                Submit
                            </button>
                        </div>
                    )}
                    {linkArea && (
                        <div className="link-edit">
                            <input
                                className="linkEditor"
                                name="link"
                                autoComplete="off"
                                onChange={handleChange}
                                placeholder="Add a link"
                            />
                            <button
                                className="bioSubmit"
                                onClick={handleLinkSubmit}
                            >
                                Save
                            </button>
                        </div>
                    )}
                </div>
            </>
        );
    } else if (!bio) {
        return (
            <>
                <div className="bioEditor">
                    <button className="bioSubmit" onClick={showTextArea}>
                        Add bio
                    </button>
                    <div className="links" onClick={showLinkArea}>
                        {links}
                    </div>
                    <button className="bioSubmit" onClick={showLinkArea}>
                        Edit links
                    </button>

                    {textArea && (
                        <div className="edit">
                            <textarea
                                className="bioEditor"
                                maxLength={35}
                                name="bio"
                                onChange={handleChange}
                                placeholder={bio}
                            />
                            <button
                                className="bioSubmit"
                                onClick={handleBioSubmit}
                            >
                                Submit
                            </button>
                        </div>
                    )}
                    {linkArea && (
                        <div className="link-edit-no-bio">
                            <input
                                className="linkEditor"
                                name="link"
                                autoComplete="off"
                                onChange={handleChange}
                                placeholder={links}
                            />
                            <button
                                className="bioSubmit"
                                onClick={handleLinkSubmit}
                            >
                                Save
                            </button>
                        </div>
                    )}
                </div>
            </>
        );
    } else {
        return (
            <>
                <div className="bioEditor">
                    <div className="bio" onClick={showTextArea}>
                        {bio}
                    </div>
                    <button className="bioSubmit" onClick={showTextArea}>
                        Edit
                    </button>
                    <div className="links" onClick={showLinkArea}>
                        {links}
                    </div>
                    <button className="bioSubmit" onClick={showLinkArea}>
                        Edit links
                    </button>

                    {textArea && (
                        <div className="edit">
                            <textarea
                                className="bioEditor"
                                maxLength={35}
                                name="bio"
                                onChange={handleChange}
                                placeholder={bio}
                            />
                            <button
                                className="bioSubmit"
                                onClick={handleBioSubmit}
                            >
                                Submit
                            </button>
                        </div>
                    )}
                    {linkArea && (
                        <div className="link-edit">
                            <input
                                className="linkEditor"
                                name="link"
                                autoComplete="off"
                                onChange={handleChange}
                                placeholder={links}
                            />
                            <button
                                className="bioSubmit"
                                onClick={handleLinkSubmit}
                            >
                                Save
                            </button>
                        </div>
                    )}
                </div>
            </>
        );
    }
}
