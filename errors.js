exports.handle404s = (req, res) => {
  res.status(404).send({ message: "Invalid URL" });
};
