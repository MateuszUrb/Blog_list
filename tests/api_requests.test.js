const supertest = require("supertest");
const { test, after, beforeEach, describe, before } = require("node:test");
const mongoose = require("mongoose");
const { blogs: initialBlogs } = require("./mock_blogList");
const assert = require("node:assert");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blogs");
const User = require("../models/users");
const { log } = require("node:console");

let mock_user = {
  token: "",
  userId: "",
};

const userCred = {
  username: "test_user",
  name: "test_user",
  password: "test_user",
};
const userLogin = {
  username: "test_user",
  password: "test_user",
};

before(async () => {
  await User.deleteMany({});

  const postUser = await api
    .post("/api/users")
    .send(userCred)
    .set("Content-Type", "application/json");

  const login = await api.post("/api/login").send(userLogin);
  mock_user.token = login.body.token;
  mock_user.userId = postUser.body.id;
});

beforeEach(async () => {
  await Blog.deleteMany({});

  await Promise.all(
    initialBlogs.map(async (blog) => {
      let blogObj = new Blog(blog);
      await blogObj.save();
    }),
  );
});

describe("blog post are correctly fetched ", () => {
  test("all blog post are returned", async () => {
    const blog = await api
      .get("/api/blogs")
      .set("Authorization", `Bearer ${mock_user.token}`);

    assert.strictEqual(blog.body.length, initialBlogs.length);
  });
  test("blogs return statuscode 403 if Authorization header is missing ", async () => {
    const blog = await api.get("/api/blogs").expect(403);
  });
  test("blog post have properly formated id key", async () => {
    const resultBlog = await api
      .get(`/api/blogs/`)
      .expect(200)
      .set("Authorization", `Bearer ${mock_user.token}`)
      .expect("Content-Type", /application\/json/);

    const blogFromDB = await Blog.findById(resultBlog.body[0].id);

    assert.strictEqual(resultBlog.body[0].id, blogFromDB._id.toString());
  });
});

describe("posting blog posts", () => {
  test("a blog can be added", async () => {
    const newBLog = {
      title: "Testing post req",
      author: "mock_test",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      userId: `${mock_user.userId}`,
    };
    await api
      .post("/api/blogs/")
      .send(newBLog)
      .expect(201)
      .set("Authorization", `Bearer ${mock_user.token}`)
      .expect("Content-Type", /application\/json/);

    const getBlog = await Blog.find({});

    const blogPost = getBlog.map((blog) => blog.toJSON());

    const blogContent = blogPost.map((b) => b.title);

    assert.strictEqual(getBlog.length, initialBlogs.length + 1);
    assert(blogContent.includes(newBLog.title));
  });

  test("returns statuscode 403 if Authorization header is missing ", async () => {
    const newBLog = {
      title: "Testing post req",
      author: "mock_test",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      userId: `${mock_user.userId}`,
    };
    await api
      .post("/api/blogs/")
      .send(newBLog)
      .expect(403)
      .expect("Content-Type", /application\/json/);

    const getBlog = await Blog.find({});

    const blogPost = getBlog.map((blog) => blog.toJSON());

    const blogContent = blogPost.map((b) => b.title);

    assert.strictEqual(getBlog.length, initialBlogs.length);
    assert(!blogContent.includes(newBLog.title));
  });
  test("like default to 0 if they are missing in req", async () => {
    const newBlog = {
      title: "test likes",
      author: "me",
      url: "https://google.com",
      userId: `${mock_user.userId}`,
    };

    const initialBlogs = await Blog.find({});

    await api
      .post("/api/blogs/")
      .send(newBlog)
      .set("Authorization", ` Bearer ${mock_user.token}`)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogAfter = await Blog.find({});
    const savedBlog = blogAfter[blogAfter.length - 1];

    assert.strictEqual(blogAfter.length, initialBlogs.length + 1);
    assert.strictEqual(savedBlog.likes, 0);
  });
  test("a blog returns 400 if title or url are missing", async () => {
    const blogTitleMissing = {
      author: "me",
      url: "https://google.com",
      likes: 69,
    };
    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${mock_user.token}`)
      .send(blogTitleMissing)
      .expect(400);
  });
});

describe("deleting posts", () => {
  test("a blog with given id is correctly deleted", async () => {
    const mockUserId = mock_user.userId; // Assume mock_user is defined elsewhere
    const blogs = await Blog.find({});
    const blog_id = blogs[0]._id.toString(); // Get the ID of the first blog

    // Link the blog to the mock user
    await Blog.findByIdAndUpdate(blog_id, { users: [mockUserId] });

    await api
      .delete(`/api/blogs/${blog_id}`)
      .send({ userId: mockUserId })
      .set("Authorization", `Bearer ${mock_user.token}`)
      .expect(204);

    const blogAfterDelete = await Blog.find({});
    const content = blogAfterDelete.map((b) => b.title);

    assert(!content.includes(blogs[0].title));
    assert.strictEqual(blogAfterDelete.length, blogs.length - 1); // Verify the blog count is reduced
  });

  test("fails with statuscode 404 id is invalid, blog not found", async () => {
    const invalidId = "5a3d5da59070081a82a69420";
    await api
      .delete(`/api/blogs/${invalidId}`)
      .expect(404)
      .set("Authorization", `Bearer ${mock_user.token}`);
  });
});

describe("updating blogs", () => {
  test("blog post likes are updated", async () => {
    const blog = initialBlogs[0];
    const blogLikes = {
      likes: 42,
    };

    await api
      .put(`/api/blogs/${blog._id}`)
      .send(blogLikes)
      .expect(200)
      .set("Authorization", `Bearer ${mock_user.token}`);
  });
  test("fails with statuscode 404 when trying to pass invalid id", async () => {
    const invalidId = "5a3d5da59070081a82a69420";

    await api
      .put(`/api/blogs/${invalidId}`)
      .expect(404)
      .set("Authorization", `Bearer ${mock_user.token}`);
  });
});

after(async () => {
  await mongoose.connection.close();
});
