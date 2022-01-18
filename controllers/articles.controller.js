const selectArticleByID = require("../models/articles.model");

exports.getArticleByID = (req, res) => {
  console.log("in the controller");

  const { article_id } = req.params;

  selectArticleByID(article_id);
};
