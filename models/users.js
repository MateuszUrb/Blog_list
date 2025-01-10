const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minLength: [3, "must be at least 3 characters long"],
    required: [true, "Username is required"],
    unique: true,
  },
  passwordHash: [
    {
      type: String,
      required: [true, "password is required"],
    },
  ],
  name: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  ],
});

userSchema.set("toJSON", {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj.__v;
    delete returnedObj._id;
    delete returnedObj.passwordHash;
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
