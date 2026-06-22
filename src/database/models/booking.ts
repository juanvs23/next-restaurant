import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phoneNumber: { type: String },
    dateTime: { type: Date, required: true },
    date: { type: String }, // YYYY-MM-DD extracted from dateTime
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

// Auto-set date from dateTime before saving
bookingSchema.pre("save", function (next) {
  if (this.dateTime && !this.date) {
    this.date = this.dateTime.toISOString().split("T")[0];
  }
  next();
});

bookingSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate() as any;
  if (update?.dateTime && !update?.date) {
    update.date = new Date(update.dateTime).toISOString().split("T")[0];
  }
  next();
});

// Unique index to prevent double-booking at database level
// A table cannot have two active bookings on the same date+turnTime
bookingSchema.index(
  { tableId: 1, date: 1, turnTime: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: ["pending", "confirmed"] },
      tableId: { $ne: null },
    },
  }
);

export const Booking =
  (mongoose.models?.Booking as any) || mongoose.model("Booking", bookingSchema);
