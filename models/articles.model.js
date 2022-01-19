const db = require("../db/connection");

// comment count coming back as string
exports.selectArticleByID = (article_id) => {
  const articleQuery = `SELECT articles.*, COUNT(comment_id) AS comment_count
    FROM articles 
    LEFT JOIN comments 
    ON articles.article_id = comments.article_id
    WHERE articles.article_id=$1
    GROUP BY articles.article_id;`;

  return db.query(articleQuery, [article_id]).then(({ rows }) => {
    return rows[0];
  });
};

exports.updateArticleVotes = (body, article_id) => {
  console.log("in the model");

  return db
    .query(
      `UPDATE articles SET votes=votes+$1 WHERE article_id=$2 RETURNING *;`,
      [body.inc_votes, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.selectArticles = (sort_by = "created_at", order = "desc", topic) => {
  if (
    ![
      "article_id",
      "title",
      "body",
      "votes",
      "topic",
      "author",
      "created_at",
    ].includes(sort_by)
  ) {
    return Promise.reject({ status: 400, message: "Invalid query" });
  }

  if (!["asc", "desc"].includes(order)) {
    return Promise.reject({ status: 400, message: "Invalid query" });
  }

  sqlString = `SELECT articles.*, COUNT(comment_id) AS comment_count
  FROM articles 
  LEFT JOIN comments 
  ON articles.article_id = comments.article_id
  GROUP BY articles.article_id
  ORDER BY ${sort_by} ${order}`;

  return db.query(sqlString).then(({ rows }) => {
    return rows;
  });
};