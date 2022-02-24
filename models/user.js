const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: String,
  image: String,
  zip: Number,
  msid: { type: String, unique: true },
  circles: [{ type: Schema.Types.ObjectId, ref: "Circle" }],
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
});

module.exports = mongoose.model("User", userSchema);
