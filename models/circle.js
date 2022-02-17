
const mongoose = require("mongoose");
const { Schema } = mongoose;

const circleSchema = new Schema({
  name: String,
  image: String,
  private: Boolean,
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
});


module.exports = mongoose.model('Circle', circleSchema);