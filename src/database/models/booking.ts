import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phoneNumber: { type: String },
    dateTime: { type: Date, required: true },
    turnTime: {
      type: String,
      enum: ["morning", "afternoon", "evening"],
      required: true,
    },
    numberPersons: { type: Number, required: true },
    arrivalTime: { type: String },
    departureTime: { type: String },
    comments: { type: String },
    tableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "rescheduled", "cancelled", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Booking =
  (mongoose.models?.Booking as any) || mongoose.model("Booking", bookingSchema);
