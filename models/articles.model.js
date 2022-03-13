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
      if (!rows[0]) {
        return Promise.reject({ status: 404, message: "No Data Found" });
      }
      return rows[0];
    });
};

exports.selectArticles = (
  sort_by = "created_at",
  order = "desc",
  topic,
  limit = 10,
  p = 1
) => {
  // create variable list and start of SQL
  const queryValues = [];
  let sqlString = `SELECT articles.article_id, articles.title, articles.votes, articles.topic, articles.author, articles.created_at, COUNT(comment_id) AS comment_count, COUNT(*) OVER() AS total_count
  FROM articles
  LEFT JOIN comments 
  ON articles.article_id = comments.article_id`;

  // sort_by conditional logic - error
  if (
    ![
      "article_id",
      "title",
      "votes",
      "topic",
      "author",
      "created_at",
      "comment_count",
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
    sqlString += ` WHERE topic=$1 GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;

    return db.query(sqlString, [topic]).then(({ rows }) => {
      // if (!rows[0]) {
      //   return Promise.reject({ status: 404, message: "Nothing Found" });
      // }
      return rows;
    });
  } else {
    sqlString += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;

    sqlString += ` LIMIT ${limit} OFFSET ${p * limit - limit};`;

    return db.query(sqlString).then(({ rows }) => {
      return rows;
    });
  }
};

exports.insertArticle = ({ author, title, body, topic }) => {
  if (!author || !title || !body || !topic) {
    return Promise.reject({ status: 400, message: "Missing Data" });
  }

  return db
    .query(
      `INSERT INTO articles (author, title, body, topic) VALUES ($1, $2, $3, $4) RETURNING *`,
      [author, title, body, topic]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.removeArticle = (article_id) => {
  return db
    .query("DELETE FROM articles WHERE article_id=$1 RETURNING *", [article_id])
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({ status: 404, message: "Not Found" });
      }
      return rows[0];
    });
};
