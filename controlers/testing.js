const router = require("express").Router();
const Blog = require("../models/blogs");
const User = require("../models/users");

router.post("/reset", async (req, res) => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  res.status(204).end();
});

module.exports = router;
