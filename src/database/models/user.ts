import mongoose, { Model } from "mongoose";

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
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const UserModel = (mongoose.models?.User as Model<any>) || mongoose.model("User", userSchema);
export { UserModel as User };
