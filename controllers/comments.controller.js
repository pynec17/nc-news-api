const { selectCommentsByArticleId } = require("../models/comments.model");

exports.getCommentsByArticleID = (req, res) => {
  const { article_id } = req.params;

  selectCommentsByArticleId(article_id).then((comments) => {
    console.log(comments);
    res.status(200).send({ comments });
  });
};
