import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    url: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number }, // bytes
    width: { type: Number },
    height: { type: Number },
    // SEO metadata
    alt: { type: String, default: "" },
    title: { type: String, default: "" },
    caption: { type: String, default: "" },
    description: { type: String, default: "" },
    // Reference to related entity (optional)
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

mediaSchema.index({ refType: 1, refId: 1 });

export const Media =
  mongoose.models?.Media || mongoose.model("Media", mediaSchema);
