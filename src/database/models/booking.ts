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
    comments: { type: String },
    tableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

bookingSchema.index({ dateTime: 1, turnTime: 1 });
bookingSchema.index({ email: 1 });
bookingSchema.index({ status: 1 });

export const Booking =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
