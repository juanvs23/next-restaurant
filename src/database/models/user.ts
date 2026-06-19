import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    googleId: { type: String, unique: true, sparse: true },
    role: {
      type: String,
      enum: ["admin", "staff", "user"],
      default: "user",
    },
    image: { type: String },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ googleId: 1 }, { unique: true, sparse: true });

export const User =
  mongoose.models.User || mongoose.model("User", userSchema);
