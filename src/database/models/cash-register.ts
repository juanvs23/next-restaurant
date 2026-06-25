import mongoose from "mongoose";

const cashRegisterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    active: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const CashRegister =
  (mongoose.models?.CashRegister as any) || mongoose.model("CashRegister", cashRegisterSchema);
