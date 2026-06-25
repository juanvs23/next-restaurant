import mongoose from "mongoose";

const taxSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },           // "IVA 16%", "Alcohol 5%"
    rate: { type: Number, required: true },            // 0.16, 0.05
    scope: {
      type: String,
      enum: ["product", "global"],
      required: true,
    },
    // For "product" scope: which categories this applies to
    // Empty array = applies to ALL products
    categoryIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    // For "global" scope: what it applies to
    applyToServiceCharge: { type: Boolean, default: false },
    applyToDelivery: { type: Boolean, default: false },
    // Active toggle — disable without deleting
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Tax =
  (mongoose.models?.Tax as any) || mongoose.model("Tax", taxSchema);
