const { selectArticleByID } = require("../models/articles.model.js");

exports.getArticleByID = (req, res) => {
  console.log("in the controller");

  const { article_id } = req.params;

  selectArticleByID(article_id).then((article) => {
    console.log({ article });
    res.status(200).send({ article });
  });
};
