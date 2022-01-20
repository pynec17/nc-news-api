const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controller.js");
const {
  getArticleByID,
  patchArticleVotes,
  getArticles,
} = require("./controllers/articles.controller");
const {
  getCommentsByArticleID,
} = require("./controllers/comments.controller.js");
const { handle404s } = require("./errors.js");

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleByID);
app.patch("/api/articles/:article_id", patchArticleVotes);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleID);

// errors
app.all("*", handle404s);

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ message: err.message });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: "Bad Request" });
  }
});

module.exports = app;
