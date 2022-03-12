const db = require("../connection.js");
const format = require("pg-format");

const seed = (data) => {
  const { articleData, commentData, topicData, userData } = data;

  return (
    db
      // drop tables
      .query("DROP TABLE IF EXISTS comments;")
      .then(() => {
        return db.query("DROP TABLE IF EXISTS articles;");
      })
      .then(() => {
        return db.query("DROP TABLE IF EXISTS users;");
      })
      .then(() => {
        return db.query("DROP TABLE IF EXISTS topics;");
      })
      // create tables
      .then(() => {
        return db.query(`CREATE TABLE topics (
        slug TEXT PRIMARY KEY NOT NULL,
        description TEXT NOT NULL);`);
      })
      .then(() => {
        return db.query(`CREATE TABLE users (
          username TEXT PRIMARY KEY NOT NULL,
          name TEXT,
          avatar_url TEXT
        );`);
      })
      .then(() => {
        return db.query(`CREATE TABLE articles (
        article_id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        body TEXT NOT NULL,
        votes INT DEFAULT 0,
        topic TEXT REFERENCES topics(slug),
        author TEXT REFERENCES users(username),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);
      })
      .then(() => {
        return db.query(`CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        author TEXT REFERENCES users(username),
        article_id INT REFERENCES articles(article_id) ON DELETE CASCADE,
        votes INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        body TEXT NOT NULL
      )`);
      })
      .then(() => {
        const formattedTopics = topicData.map((topic) => [
          topic.slug,
          topic.description,
        ]);

        const topicSql = format(
          `INSERT INTO topics (slug, description) VALUES %L;`,
          formattedTopics
        );
        return db.query(topicSql);
      })
      .then(() => {
        const formattedUsers = userData.map((user) => [
          user.username,
          user.name,
          user.avatar_url,
        ]);

        const userSql = format(
          `INSERT INTO users (username, name, avatar_url) VALUES %L`,
          formattedUsers
        );

        return db.query(userSql);
      })
      .then(() => {
        const formattedArticles = articleData.map((article) => [
          article.title,
          article.topic,
          article.author,
          article.body,
          article.created_at,
          article.votes,
        ]);

        const articlesSql = format(
          `INSERT INTO articles (title, topic, author, body, created_at, votes) VALUES %L;`,
          formattedArticles
        );
        return db.query(articlesSql);
      })
      .then(() => {
        const formattedComments = commentData.map((comment) => [
          comment.body,
          comment.votes,
          comment.author,
          comment.article_id,
          comment.created_at,
        ]);

        const commentSql = format(
          `INSERT INTO comments (body, votes, author, article_id, created_at) VALUES %L`,
          formattedComments
        );
        return db.query(commentSql);
      })
  );
};

module.exports = { seed };
