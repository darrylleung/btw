export function ProfilePic(props) {
    let { imageurl, firstname, lastname, showUploader } = props;

    return (
        <>
            <img
                className="profilePic"
                src={imageurl || "/images/default.png"}
                alt={`${firstname} ${lastname}`}
                onClick={showUploader}
            />
        </>
    );
}
