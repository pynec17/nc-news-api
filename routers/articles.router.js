const express = require("express");
const {
  getArticleByID,
  patchArticleVotes,
  getArticles,
  postArticle,
  deleteArticle,
} = require("../controllers/articles.controller");
const {
  getCommentsByArticleID,
  postComment,
} = require("../controllers/comments.controller");

const articlesRouter = express.Router();

// "api/articles/:article_id"
articlesRouter
  .route("/:article_id")
  .get(getArticleByID)
  .patch(patchArticleVotes)
  .delete(deleteArticle);

// "api/articles"
articlesRouter.route("/").get(getArticles).post(postArticle);

// "api/articles/:article_id/comments"
articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleID)
  .post(postComment);

module.exports = articlesRouter;
