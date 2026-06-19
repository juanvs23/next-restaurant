import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    image: { type: String },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

categorySchema.index({ name: 1 }, { unique: true });

export const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);
