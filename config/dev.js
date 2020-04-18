require("dotenv").config();
module.exports = {
  googleClientID:
    "964808011168-29vqsooppd769hk90kjbjm5gld0glssb.apps.googleusercontent.com",
  googleClientSecret: "KnH-rZC23z4fr2CN4ISK4srN",
  mongoURI: process.env.MONGO_URI,
  cookieKey: "123123123",
  redisUrl: "redis://127.0.0.1:6379",
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
};
