import mongoose from "mongoose";

const cashAuditSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    workShiftId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkShift",
    },
    workShiftName: { type: String }, // snapshot
    expectedCash: { type: Number, default: 0 }, // cash payments from system
    declaredCash: { type: Number, required: true }, // counted physically
    difference: { type: Number, default: 0 }, // declared - expected
    notes: { type: String },
    createdBy: { type: String },
  },
  { timestamps: true }
);

export const CashAudit =
  (mongoose.models?.CashAudit as any) || mongoose.model("CashAudit", cashAuditSchema);
