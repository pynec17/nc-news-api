const {
  selectArticleByID,
  updateArticleVotes,
  selectArticles,
} = require("../models/articles.model.js");

exports.getArticleByID = (req, res) => {
  const { article_id } = req.params;

  selectArticleByID(article_id).then((article) => {
    res.status(200).send({ article });
  });
};

exports.patchArticleVotes = (req, res) => {
  const { article_id } = req.params;

  updateArticleVotes(req.body, article_id).then((article) => {
    res.status(200).send({ article });
  });
};

exports.getArticles = (req, res) => {
  const { sort_by, order, topic } = req.query;

  selectArticles(sort_by, order, topic)
    .then((articles) => {
      console.log(articles);
      res.status(200).send({ articles });
    })
    .catch((err) => {
      console.log(err);
    });
};
