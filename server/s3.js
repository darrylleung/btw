const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env;
} else {
    secrets = require("../secrets.json");
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

exports.upload = (req, res, next) => {
    //if there is no file! send an error message.
    if (!req.file) {
        return res.sendStatus(500);
    }

    //we only want to talk to S3 if we have a file
    // console.log("file: ", req.file);
    const { filename, mimetype, size, path } = req.file;

    const promise = s3
        .putObject({
            Bucket: "darryl-bucket-1",
            ACL: "public-read",
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise();

    promise
        .then(() => {
            // it worked!!!
            console.log("aws upload complete");
            //optional - delete image uploaded to aws from the uploads local folder
            fs.unlink(path, () => {});
            next();
        })
        .catch((err) => {
            // uh oh
            console.log("error in s3 upload: ", err);
            res.sendStatus(404);
        });
};
