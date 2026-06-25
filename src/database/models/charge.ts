import mongoose from "mongoose";

const chargeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },            // "Service 10%", "Delivery $5"
    type: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    value: { type: Number, required: true },           // 10 (= 10%), 5 (= $5)
    scope: {
      type: String,
      enum: ["product", "global"],
      required: true,
    },
    // For "product" scope: which categories to apply to
    categoryIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    // For "global" scope: what to apply to
    applyTo: {
      type: [String],
      default: ["subtotal"], // "subtotal", "delivery"
    },
    // Whether this charge applies to delivery orders only
    appliesToDelivery: { type: Boolean, default: false },
    // Active toggle
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Charge =
  (mongoose.models?.Charge as any) || mongoose.model("Charge", chargeSchema);
