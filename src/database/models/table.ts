import mongoose from "mongoose";

const tableSchema = new mongoose.Schema(
  {
    tableId: { type: String, required: true, unique: true },
    name: { type: String },
    capacity: { type: Number, required: true },
    location: {
      type: String,
      enum: ["main", "terrace", "vip", "bar"],
      default: "main",
    },
    status: {
      type: String,
      enum: ["available", "occupied", "reserved", "maintenance"],
      default: "available",
    },
  },
  { timestamps: true }
);

tableSchema.index({ tableId: 1 }, { unique: true });
tableSchema.index({ capacity: 1 });

export const TableModel =
  (mongoose.models?.Table as any) || mongoose.model("Table", tableSchema);
