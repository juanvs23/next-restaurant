import mongoose, { Model } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String },
    provider: { type: String, enum: ["google", "credentials"], default: "google" },
    googleId: { type: String, unique: true, sparse: true },
    role: {
      type: String,
      enum: ["admin", "staff", "user"],
      default: "user",
    },
    image: { type: String },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

export const User =
  (mongoose.models?.User as Model<any>) || mongoose.model("User", userSchema);
