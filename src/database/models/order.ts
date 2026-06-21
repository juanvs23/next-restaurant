import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String },
    price: { type: Number },
    quantity: { type: Number, default: 1 },
    notes: { type: String },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    tableId: { type: mongoose.Schema.Types.ObjectId, ref: "Table" },
    tableLabel: { type: String },
    items: [orderItemSchema],
    status: {
      type: String,
      enum: ["pending", "preparing", "ready", "served", "cancelled"],
      default: "pending",
    },
    notes: { type: String },
    createdBy: { type: String }, // waiter name or user ID
  },
  { timestamps: true }
);

orderSchema.index({ status: 1, createdAt: -1 });

export const Order =
  (mongoose.models?.Order as any) || mongoose.model("Order", orderSchema);
