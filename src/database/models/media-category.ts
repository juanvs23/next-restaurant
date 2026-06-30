import mongoose from "mongoose";

const mediaCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const MediaCategory =
  (mongoose.models?.MediaCategory as any) ||
  mongoose.model("MediaCategory", mediaCategorySchema);
