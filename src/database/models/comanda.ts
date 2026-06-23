import mongoose from "mongoose";

const comandaSchema = new mongoose.Schema(
  {
    tableId: { type: mongoose.Schema.Types.ObjectId, ref: "Table", default: null },
    tableLabel: { type: String },
    isDelivery: { type: Boolean, default: false },
    customerName: { type: String },
    status: {
      type: String,
      enum: ["open", "closed", "rejected"],
      default: "open",
    },
  },
  { timestamps: true }
);

comandaSchema.index({ status: 1, createdAt: -1 });

export const Comanda =
  (mongoose.models?.Comanda as any) || mongoose.model("Comanda", comandaSchema);
