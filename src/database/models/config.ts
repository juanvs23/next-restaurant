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

    // Business hours
    nonWorkingDays: {
      type: [Number],
      default: [0], // 0 = Sunday
    },

    // Holidays (specific dates)
    holidays: {
      type: [String],
      default: [], // "2026-01-01", "2026-12-25"
    },

    // Default language
    defaultLanguage: {
      type: String,
      enum: ["es", "en", "pt"],
      default: "es",
    },

    // Invoicing
    nextInvoiceNumber: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export const Config =
  (mongoose.models?.Config as any) || mongoose.model("Config", configSchema);
