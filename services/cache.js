const mongoose = require("mongoose");
const redis = require("redis");
const util = require("util");
const keys = require("../config/keys");

const exec = mongoose.Query.prototype.exec;
const redisUrl = keys.redisUrl;
const client = redis.createClient(redisUrl);
client.hget = util.promisify(client.hget);
mongoose.Query.prototype.cache = function (options = {}) {
  this._hash = JSON.stringify(options.key) || "";
  this._cash = true;
  return this;
};
mongoose.Query.prototype.exec = async function () {
  if (!this._cash) {
    return await exec.apply(this, arguments);
  }
  //combine collection name with query to create unique query
  const query = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name,
    })
  );

  //check if we have cached version of request
  const cached = await client.hget(this._hash, query);
  if (cached) {
    //if yes return cached query
    const cachedParsed = JSON.parse(cached);
    if (!cachedParsed.length) return new this.model(cachedParsed);
    return cachedParsed.map((el) => new this.model(el));
  }
  const result = await exec.apply(this, arguments);
  client.hset(this._hash, query, JSON.stringify(result), "EX", 10);
  return result;
};

module.exports = {
  clearHash(hash) {
    client.del(JSON.stringify(hash));
  },
};
