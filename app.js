require("express-async-errors");
const express = require("express");
const app = express();
const blogRouter = require("./controlers/blogs");
const usersRouter = require("./controlers/users");
const loginRouter = require("./controlers/login");
const config = require("./utils/config");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");
const cors = require("cors");
const mongoose = require("mongoose");

mongoose
  .connect(config.MONGOODB_URI)
  .then(() => {
    logger.info("connected to DB");
  })
  .catch((error) => {
    logger.error(`error connectin to DB: ${error.message}`);
  });

app.use(middleware.tokenExtractor);
app.use(cors());
app.use(express.json());

app.use("/api/blogs", middleware.userExtractor, blogRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

if (process.env.NODE_ENV === "test") {
  const testingRouter = require("./controlers/testing");
  app.use("/api/testing", testingRouter);
}

app.use(middleware.handleUnknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
