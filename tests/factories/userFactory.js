const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = async () => {
  return new User({ googleId: 2141411141, displayName: "Benedykt" }).save();
};
