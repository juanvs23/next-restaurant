import mongoose from "mongoose";

const creditNoteSchema = new mongoose.Schema(
  {
    creditNoteNumber: { type: Number, required: true, unique: true },
    originalOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    originalInvoiceNumber: { type: Number },
    customerName: { type: String },
    amount: { type: Number, required: true },
    taxAmount: { type: Number, default: 0 },
    total: { type: Number, required: true }, // amount + taxAmount
    reason: { type: String, required: true },
    createdBy: { type: String },
    items: [{
      name: { type: String },
      quantity: { type: Number },
      price: { type: Number },
    }],
  },
  { timestamps: true }
);

export const CreditNote =
  (mongoose.models?.CreditNote as any) || mongoose.model("CreditNote", creditNoteSchema);
