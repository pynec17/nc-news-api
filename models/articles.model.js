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
    if (!rows[0]) {
      return Promise.reject({ status: 404, message: "No Data Found" });
    }
    return rows[0];
  });
};

exports.updateArticleVotes = (body, article_id) => {
  if (!body.inc_votes) {
    return Promise.reject({ status: 400, message: "Bad Request" });
  }

  return db
    .query(
      `UPDATE articles SET votes=votes+$1 WHERE article_id=$2 RETURNING *;`,
      [body.inc_votes, article_id]
    )
    .then(({ rows }) => {
      console.log(rows);
      console.log(rows[0]);
      if (!rows[0]) {
        return Promise.reject({ status: 404, message: "No Data Found" });
      }
      return rows[0];
    });
};

exports.selectArticles = (sort_by = "created_at", order = "desc", topic) => {
  console.log(sort_by);
  console.log(order);
  console.log(topic);

  // create variable list and start of SQL
  const queryValues = [];
  let sqlString = `SELECT articles.*, COUNT(comment_id) AS comment_count
  FROM articles 
  LEFT JOIN comments 
  ON articles.article_id = comments.article_id`;

  // sort_by conditional logic - error
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
    return Promise.reject({ status: 400, message: "Invalid sort_by" });
  }

  // order conditional logic - error
  if (!["asc", "desc"].includes(order)) {
    return Promise.reject({ status: 400, message: "Invalid order" });
  }

  // topic conditional logic

  if (topic) {
    queryValues.push(topic);
    sqlString += ` WHERE topic=$1 GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`;

    return db.query(sqlString, [topic]).then(({ rows }) => {
      return rows;
    });
  } else {
    sqlString += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`;

    return db.query(sqlString).then(({ rows }) => {
      return rows;
    });
  }
};
