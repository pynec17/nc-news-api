exports.selectArticleByID = (article_id) => {
  console.log("in the model");

  return db
    .query("SELECT * FROM articles WHERE id=$1;", [article_id])
    .then(({ rows }) => {
      console.log(rows);
    });
};
