const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");
const blogsList = require("./mock_blogList");

describe("dummy", () => {
  test("dummy returns one", () => {
    const blogs = [];
    const result = listHelper.dummy(blogs);
    assert.strictEqual(result, 1);
  });
});

describe("totalLikes", () => {
  test("totalLikes empty list is zero likes", () => {
    const blogs = [];
    const result = listHelper.totalLikes(blogs);
    assert.strictEqual(result, 0);
  });
  test("when list has only one entry", () => {
    const listWithOneBlog = [
      {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
        likes: 5,
        __v: 0,
      },
    ];
    const result = listHelper.totalLikes(listWithOneBlog);
    assert.strictEqual(result, listWithOneBlog[0].likes);
  });

  test("list of likes is big and calculated right", () => {
    const result = listHelper.totalLikes(blogsList.blogs);
    assert.strictEqual(result, 36);
  });

  test("blog with most likes", () => {
    const result = listHelper.favoriteBlog(blogsList.blogs);
    assert.deepStrictEqual(result, {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    });
  });

  test("find author with larges amount of blog post", () => {
    const result = listHelper.mostBlogs(blogsList.blogs);
    assert.deepStrictEqual(result, {
      author: "Robert C. Martin",
      blogs: 3,
    });
  });
  test("post with most likes", () => {
    const result = listHelper.mostLikes(blogsList.blogs);
    assert.deepStrictEqual(result, {
      author: "Edsger W. Dijkstra",
      likes: 17,
    });
  });
});
