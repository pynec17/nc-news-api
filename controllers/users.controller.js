const { selectUsers, selectUser } = require("../models/users.model");

exports.getAllUsers = (req, res) => {
  selectUsers().then((users) => {
    console.log({ users });
    res.status(200).send({ users });
  });
};

exports.getUser = (req, res, next) => {
  const { username } = req.params;

  selectUser(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};
