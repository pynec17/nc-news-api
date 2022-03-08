const express = require("express");
const {
  removeComment,
  patchCommentVotes,
} = require("../controllers/comments.controller");

const commentsRouter = express.Router();

commentsRouter
  .route("/:comment_id")
  .delete(removeComment)
  .patch(patchCommentVotes);

module.exports = commentsRouter;
