import mongoose from "mongoose";

const configSchema = new mongoose.Schema(
  {
    // Business info (public)
    businessName: { type: String, default: "GERÍCHT" },
    rif: { type: String, default: "" },
    businessAddress: { type: String, default: "" },
    businessPhone: { type: String, default: "" },
    businessEmail: { type: String, default: "" },

    // Tax
    taxRate: { type: Number, default: 0 },       // 0.16 = 16% IVA
    serviceChargeTaxable: { type: Boolean, default: false },

    // Charges
    serviceChargeRate: { type: Number, default: 0.10 },
    defaultDeliveryCost: { type: Number, default: 5 },

    // Payment methods
    paymentMethods: {
      type: [String],
      default: ["cash", "card", "transfer", "invoice"],
    },

    // Invoicing
    nextInvoiceNumber: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export const Config =
  (mongoose.models?.Config as any) || mongoose.model("Config", configSchema);
