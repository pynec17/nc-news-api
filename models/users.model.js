const db = require("../db/connection");

exports.selectUsers = () => {
  return db.query("SELECT username FROM users;").then(({ rows }) => {
    return rows;
  });
};

exports.selectUser = (username) => {
  // console.log(typeof username);
  return db
    .query("SELECT * FROM users WHERE username=$1", [username])
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({ status: 404, message: "No user found" });
      }
      return rows[0];
    });
};
