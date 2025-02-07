const blogRouter = require("express").Router();
const middleware = require("../utils/middleware");
const jwt = require("jsonwebtoken");
const Blog = require("../models/blogs");
const User = require("../models/users");

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("users", {
    username: 1,
    name: 1,
    id: 1,
  });
  response.json(blogs);
});

blogRouter.post("/", middleware.userExtractor, async (request, response) => {
  const body = request.body;
  const user = request.user;
  const token = request.token;

  if (!token) {
    return response.status(401).json({ error: "invalid token" });
  }

  if (!body.url || !body.title) {
    return response.status(400).json({ error: "missing title or url key" });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url ?? null,
    likes: body.likes || 0,
    users: user.id,
  });

  const saveBlog = await blog.save();
  user.blogs = user.blogs.concat(saveBlog._id);
  await user.save();

  response.status(201).json(saveBlog);
});

blogRouter.delete("/:id", async (request, response) => {
  const id = request.params.id;
  const userId = request.body.userId;
  const blog = await Blog.findById(id);

  if (!blog) {
    return response.status(404).json({ error: "Blog not found" });
  }
  if (blog.users.toString() === userId.toString()) {
    const deleteBlog = await Blog.findByIdAndDelete(id);

    if (!deleteBlog) {
      return response.status(404).json({ error: "Blog not found" });
    }
  } else {
    return response
      .status(401)
      .json({ error: "You can only remove blogs created by you" });
  }

  response.status(204).end();
});

blogRouter.put("/:id", middleware.userExtractor, async (request, response) => {
  const body = request.body;
  const blog = {
    likes: body.likes,
  };
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });
  if (!updatedBlog) {
    return response.status(404).json({ error: "invalid Id" });
  }

  response.json(updatedBlog);
});
module.exports = blogRouter;
