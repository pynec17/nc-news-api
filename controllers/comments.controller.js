const {
  selectCommentsByArticleId,
  insertComment,
  deleteComment,
} = require("../models/comments.model");

exports.getCommentsByArticleID = (req, res, next) => {
  const { article_id } = req.params;

  selectCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const { username, body } = req.body;
  const { article_id } = req.params;

  insertComment(username, body, article_id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.removeComment = (req, res, next) => {
  const { comment_id } = req.params;
  deleteComment(comment_id)
    .then((comment) => {
      res.sendStatus(204);
    })
    .catch((err) => {
      next(err);
    });
};
