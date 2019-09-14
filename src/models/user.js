import mongoose from "mongoose";

export const User = mongoose.model("User", {
  email: String,
  first_name: String,
  last_name: String
});
