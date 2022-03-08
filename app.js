const express = require("express");
const cors = require("cors");

const {
  getCommentsByArticleID,
  postComment,
  removeComment,
  patchCommentVotes,
} = require("./controllers/comments.controller.js");
const {
  handle404s,
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errors.js");

const { getAllUsers, getUser } = require("./controllers/users.controller.js");
const apiRouter = require("./routers/api.router");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

// errors
app.all("*", handle404s);
app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
