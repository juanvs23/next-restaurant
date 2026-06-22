import mongoose from "mongoose";

const sizePriceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    tax: { type: Number, default: 0 },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    type: { type: String, enum: ["drink", "food", "dessert"], default: "food" },
    turnIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Turn" }],
    images: [{ type: String }],
    ingredients: [{ type: String }],
    sizes: [sizePriceSchema],
    SKU: { type: String, unique: true },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Product =
  (mongoose.models?.Product as any) || mongoose.model("Product", productSchema);
