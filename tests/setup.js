const mongoose = require("mongoose");
const keys = require("../config/keys");

require("../models/User");
mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

module.exports = () => {
  return mongoose.connection.close();
};
