const jwt = require("jsonwebtoken");
const User = require("../models/users");

function handleUnknownEndpoint(req, res) {
  res.status(404).json({ error: "Unknown endpoint" });
}

function errorHandler(error, req, res, next) {
  if (error.name === "CastError") {
    return res.status(400).json({ error: "uncorrect  data" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  } else if (
    error.name === "MongoServerError" &&
    error.message.includes("E11000 duplicate key error")
  ) {
    return res.status(400).json({ error: "expected `username` to be unique" });
  } else if (error.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "token invalid" });
  } else if (error.name === "TokenExpiredError") {
    return res.status(401).json({ error: "token expired" });
  }
}

function tokenExtractor(req, res, next) {
  const authorization = req.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    req.token = authorization.replace("Bearer ", "");
    next();
  } else {
    next();
  }
}

async function userExtractor(req, res, next) {
  if (!req.token) {
    res.status(403).json({ error: "token not received" });
  } else {
    const decodedToken = jwt.verify(req.token, process.env.SECRET);
    req.user = await User.findById(decodedToken.id);
    next();
  }
}

module.exports = {
  handleUnknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
};
