import { Schema, model, trusted } from "mongoose";

var postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  imageId: {
    type: String,
    required: false,
  },
  date: {
    type: Date,
    required: true,
  },
  user: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const PostModel = model("Post", postSchema);

module.exports = { PostModel };
