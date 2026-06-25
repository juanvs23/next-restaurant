import mongoose from "mongoose";

const dayClosingSchema = new mongoose.Schema(
  {
    date: { type: String, required: true, unique: true }, // "2026-06-23"
    closedBy: { type: String }, // user name or email
    summary: {
      totalOrders: { type: Number, default: 0 },
      totalRevenue: { type: Number, default: 0 },
      totalSubtotal: { type: Number, default: 0 },
      totalTax: { type: Number, default: 0 },
      totalCharges: { type: Number, default: 0 },
      avgTicket: { type: Number, default: 0 },
    },
    warnings: {
      openComandas: { type: Number, default: 0 },
      pendingBills: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export const DayClosing =
  (mongoose.models?.DayClosing as any) || mongoose.model("DayClosing", dayClosingSchema);
