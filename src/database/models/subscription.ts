import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true }
);

subscriptionSchema.index({ email: 1 }, { unique: true });

export const Subscription =
  mongoose.models.Subscription ||
  mongoose.model("Subscription", subscriptionSchema);
