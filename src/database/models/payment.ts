import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    method: {
      type: String,
      enum: ["cash", "card", "transfer", "invoice"],
      required: true,
    },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "paid",
    },
    reference: { type: String },
    cardLast4: { type: String },
    notes: { type: String },
    paidAt: { type: Date, default: Date.now },
    createdBy: { type: String },
  },
  { timestamps: true }
);

paymentSchema.index({ orderId: 1 });

export const Payment =
  (mongoose.models?.Payment as any) || mongoose.model("Payment", paymentSchema);
