const db = require("../db/connection");

exports.selectCommentsByArticleId = (article_id) => {
  console.log(article_id);

  return db
    .query("SELECT * FROM comments WHERE article_id=$1;", [article_id])
    .then(({ rows }) => {
      return rows;
    });
};
