const db = require("../db/connection");

exports.selectCommentsByArticleId = (article_id, limit = 10, p = 1) => {
  const offset = limit * p - limit;

  return db
    .query(
      "SELECT *, COUNT(*) OVER() AS full_count FROM comments WHERE article_id=$1 ORDER BY created_at DESC LIMIT $2 OFFSET $3;",
      [article_id, limit, offset]
    )
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

exports.updateVoteCount = (inc_votes, comment_id) => {
  if (!inc_votes) {
    return Promise.reject({ status: 400, message: "Bad Request" });
  }
  return db
    .query(
      "UPDATE comments SET votes=votes+$1 WHERE comment_id=$2 RETURNING *",
      [inc_votes, comment_id]
    )
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({ status: 404, message: "No comment found" });
      }
      return rows[0];
    });
};
