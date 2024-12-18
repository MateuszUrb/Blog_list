const express = require("express");
const app = express();
const blogRouter = require("./controlers/blog");
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

app.use(cors());
app.use(express.json());

app.use("/api/blog", blogRouter);

app.use(middleware.handleUnknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
