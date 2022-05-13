import { useState } from "react";
import { ProfilePic } from "./profilepic";
import { BioEditor } from "./bioeditor";
import { Textfit } from "react-textfit";
import { Wall } from "./wall";
import { WritingComponent } from "./writingcomponent";
import { Chat } from "./globalchat";

export function Profile(props) {
    const [writingComponent, setWritingComponent] = useState(false);

    const showWritingComponent = () => {
        if (!writingComponent) {
            setWritingComponent(true);
        } else {
            setWritingComponent(false);
        }
    };

    const {
        firstname,
        lastname,
        imageurl,
        showUploader,
        bio,
        links,
        setNewBio,
        setNewLinks,
    } = props;

    return (
        <div className="profileContainer">
            <div className="app-left">
                <div className="bioContainer">
                    <div className="profilePicContainer">
                        <ProfilePic
                            imageurl={imageurl}
                            firstname={firstname}
                            lastname={lastname}
                            showUploader={showUploader}
                        />
                    </div>
                    <div className="bioTextContainer">
                        <Textfit
                            className="bioText"
                            mode="single"
                            // forceSingleModeWidth={false}
                            min={24}
                            max={48}
                        >
                            <span className="username">
                                {firstname} {lastname}
                            </span>
                        </Textfit>
                        <BioEditor
                            setNewBio={setNewBio}
                            bio={bio}
                            setNewLinks={setNewLinks}
                            links={links}
                        />
                    </div>
                </div>
                <div className="additionalBioContainer">
                    <Chat />
                </div>
            </div>
            <div className="app-right">
                {/* <div className="wallContainer"> */}
                <Wall />
                {/* </div> */}
            </div>
            {writingComponent && (
                <>
                    <div className="blogContainer">
                        <div className="writingComponentContainer">
                            <WritingComponent
                                showWritingComponent={showWritingComponent}
                            />
                        </div>
                    </div>
                    <div className="overlay" onClick={showWritingComponent} />
                </>
            )}
            <button className="writingComponent" onClick={showWritingComponent}>
                ✍🏻
            </button>
        </div>
    );
}
