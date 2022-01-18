const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controller.js");
const { getArticleByID } = require("./controllers");

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleByID);

// handles all bad requests - doesn't catch valid request, isn't a 4-input error handler either
app.all("*", (req, res) => {
  res.status(404).send({ message: "Invalid URL" });
});

module.exports = app;
