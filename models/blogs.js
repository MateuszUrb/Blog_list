const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, "Comment is required"],
    },
  },
  { _id: true },
);

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "title is required"],
  },
  author: {
    type: String,
    required: [true, "author is required"],
  },
  url: {
    type: String,
    required: [true, "url is required"],
  },
  likes: Number,
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comments: [commentSchema],
});

blogSchema.set("toJSON", {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj._id;
    delete returnedObj.__v;
    if (returnedObj.comments) {
      returnedObj.comments = returnedObj.comments.map((comment) => ({
        id: comment._id.toString(),
        comment: comment.comment,
      }));
    }
  },
});

module.exports = mongoose.model("Blog", blogSchema);
