const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentSchema = new Schema({
  content: String,
  createdAt: { type: Date, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  score: Number,
});

const postSchema = new Schema({
  description: String,
  title: String,
  user: { type: Schema.Types.ObjectId, ref: "User" },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  circle: { type: Schema.Types.ObjectId, ref: "Circle" },
  createdAt: { type: Date, default: Date.now },
  anonymous: { type: Boolean, default: false },
  score: Number,
});

module.exports = {
  Post: mongoose.model("Post", postSchema),
  Comment: mongoose.model("Comment", commentSchema),
};
