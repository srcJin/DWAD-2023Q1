const { Users } = require("../models");
const { hash } = require("../utils");

exports.getUserByUsername = (username) =>
  Users.where({
    username,
  }).fetch({ require: false });

/**
 * Checks the credentials and returns the user object if verification is
 * successful.
 */
exports.verify = (username, password) =>
  this.getUserByUsername(username).then((user) => {
    if (!user || user.get("password") !== hash(password)) {
      return null;
    }

    return user;
  });

exports.createUser = (username, password, email) => {
  const user = new Users({
    username,
    password: hash(password),
    email,
  });
  return user.save();
};
