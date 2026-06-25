import mongoose from "mongoose";

const workShiftSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    startTime: { type: String, required: true }, // "08:00"
    endTime: { type: String, required: true },   // "16:00"
    active: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const WorkShift =
  (mongoose.models?.WorkShift as any) || mongoose.model("WorkShift", workShiftSchema);
