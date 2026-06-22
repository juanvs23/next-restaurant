import mongoose, { Model } from "mongoose";

const turnSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    sortOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    color: { type: String, default: "#DCCA87" },
  },
  { timestamps: true }
);

turnSchema.index({ sortOrder: 1 });

export const Turn =
  (mongoose.models?.Turn as Model<any>) || mongoose.model("Turn", turnSchema);
