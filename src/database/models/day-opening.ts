import mongoose from "mongoose";

const dayOpeningSchema = new mongoose.Schema(
  {
    date: { type: String, required: true, unique: true }, // "2026-06-24"
    openedBy: { type: String },
    openedAt: { type: Date, default: Date.now },
    workShiftId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkShift",
    },
    notes: { type: String },
  },
  { timestamps: true }
);

export const DayOpening =
  (mongoose.models?.DayOpening as any) || mongoose.model("DayOpening", dayOpeningSchema);
