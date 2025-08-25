import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, index: true },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
