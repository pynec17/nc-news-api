const db = require("../db/connection");

exports.selectCommentsByArticleId = (article_id) => {
  return db
    .query("SELECT * FROM comments WHERE article_id=$1;", [article_id])
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({ status: 404, message: "Not Found" });
      }
      return rows;
    });
};

exports.insertComment = (username, body, article_id) => {
  if (!username || !body) {
    return Promise.reject({ status: 400, message: "Bad Request" });
  }

  return db
    .query(
      `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *`,
      [username, body, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.deleteComment = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id=$1 RETURNING *`, [comment_id])
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({ status: 404, message: "Not Found" });
      }
      return rows[0];
    });
};
