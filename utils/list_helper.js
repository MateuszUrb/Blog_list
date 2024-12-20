function dummy(blogs) {
  return 1;
}

function totalLikes(blogs) {
  if (blogs.length === 0) return 0;
  return blogs.reduce((sum, blog) => {
    return sum + blog.likes;
  }, 0);
}

function favoriteBlog(blogs) {
  let blogWithMostLikes = 0;
  let mostLikedBlog;

  for (let i = 0; i < blogs.length; i++) {
    const blog = blogs[i];

    if (blog.likes > blogWithMostLikes) {
      blogWithMostLikes = blog.likes;
      mostLikedBlog = {
        title: blog.title,
        author: blog.author,
        likes: blog.likes,
      };
    }
  }
  return mostLikedBlog;
}

function mostBlogs(blogs) {
  let authorWithMostBlogsPost = {
    author: "",
    blogs: 0,
  };
  for (let i = 0; i < blogs.length; i++) {
    const authorName = blogs[i].author;
    if (authorWithMostBlogsPost.author === authorName) {
      authorWithMostBlogsPost.blogs += 1;
    } else {
      authorWithMostBlogsPost.author = authorName;
      authorWithMostBlogsPost.blogs = 1;
    }
  }
  return authorWithMostBlogsPost;
}

function mostLikes(blogs) {
  let blogPost = {};

  for (let i = 0; i < blogs.length; i++) {
    const { author, likes } = blogs[i];

    if (blogPost[author]) {
      blogPost[author] += likes;
    } else {
      blogPost[author] = likes;
    }
  }

  let authorWithMostLikes = {
    author: "",
    likes: 0,
  };

  for (let author in blogPost) {
    if (blogPost[author] > authorWithMostLikes.likes) {
      authorWithMostLikes.author = author;
      authorWithMostLikes.likes = blogPost[author];
    }
  }
  return authorWithMostLikes;
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
