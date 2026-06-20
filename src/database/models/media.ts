import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    url: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number },
    width: { type: Number },
    height: { type: Number },
    alt: { type: String, default: "" },
    title: { type: String, default: "" },
    caption: { type: String, default: "" },
    description: { type: String, default: "" },
    refType: {
      type: String,
      enum: ["product", "category", "gallery", "general"],
      default: "general",
    },
    refId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
  },
  { timestamps: true }
);

export const Media =
  (mongoose.models?.Media as any) || mongoose.model("Media", mediaSchema);
