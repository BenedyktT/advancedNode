const mongoose = require("mongoose");
const keys = require("../config/keys");

jest.setTimeout(30000);
require("../models/User");
mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

/* const connectMemoryDb = async () => {
  const keys = require("../config/keys");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongod = new MongoMemoryServer();
  const uri = await mongod.getConnectionString();

  const mongooseOpts = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  };
  await mongoose.connect(uri, mongooseOpts);
};
 */
