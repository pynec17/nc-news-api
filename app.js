const express = require("express");
const { getTopics } = require("./controllers/topics.controller.js");
const {
  getArticleByID,
  patchArticleVotes,
  getArticles,
} = require("./controllers/articles.controller");
const {
  getCommentsByArticleID,
  postComment,
  removeComment,
} = require("./controllers/comments.controller.js");
const {
  handle404s,
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errors.js");
const endpoints = require("./endpoints.json");

const app = express();

app.use(express.json());

app.get("/api", (req, res, next) => {
  res.send(endpoints);
});

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleByID);
app.patch("/api/articles/:article_id", patchArticleVotes);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleID);
app.post("/api/articles/:article_id/comments", postComment);
app.delete("/api/comments/:comment_id", removeComment);

// errors
app.all("*", handle404s);
app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
