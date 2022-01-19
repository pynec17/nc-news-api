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

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleByID);
app.patch("/api/articles/:article_id", patchArticleVotes);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleID);

// handles all bad requests - doesn't catch valid request, isn't a 4-input error handler either
app.all("*", (req, res) => {
  res.status(404).send({ message: "Invalid URL" });
});

module.exports = app;
