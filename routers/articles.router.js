const express = require("express");
const {
  getArticleByID,
  patchArticleVotes,
  getArticles,
  postArticle,
} = require("../controllers/articles.controller");
const {
  getCommentsByArticleID,
  postComment,
} = require("../controllers/comments.controller");

const articlesRouter = express.Router();

articlesRouter
  .route("/:article_id")
  .get(getArticleByID)
  .patch(patchArticleVotes);

articlesRouter.route("/").get(getArticles).post(postArticle);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleID)
  .post(postComment);

module.exports = articlesRouter;
