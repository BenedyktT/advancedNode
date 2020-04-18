const AWS = require("aws-sdk");
const { accessKeyId, secretAccessKey } = require("../config/keys");
const uuid = require("uuid/v1");
const auth = require("../middlewares/requireLogin");
const s3 = new AWS.S3({
  accessKeyId,
  secretAccessKey,
});
module.exports = (app) => {
  app.get("/api/upload", auth, (req, res) => {
    const Key = `${req.user.id}/${uuid()}.jpeg`;
    s3.getSignedUrl(
      "putObject",
      {
        Bucket: "advancednodetutorial",
        Key,
        ContentType: "image/jpeg",
      },
      (err, url) => res.send({ url, key: Key })
    );
  });
};
