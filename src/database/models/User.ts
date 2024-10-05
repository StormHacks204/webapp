import { Schema, model, trusted } from "mongoose";

var userSchema = new Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true,
  },
});

const UserModel = model("User", userSchema);

module.exports = { UserModel };
