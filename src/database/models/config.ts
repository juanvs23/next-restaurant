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

    // Holidays (MM-DD for yearly, YYYY-MM-DD for specific dates)
    holidays: {
      type: [String],
      default: [], // "12-25" (Christmas yearly), "2026-06-15" (one-time)
    },

    // Default language
    defaultLanguage: {
      type: String,
      enum: ["es", "en", "pt"],
      default: "es",
    },

    // Invoicing
    nextInvoiceNumber: { type: Number, default: 1 },
    nextCreditNoteNumber: { type: Number, default: 1 },

    // Timezone
    timezone: { type: String, default: "-04:00" }, // Venezuela UTC-4

    // Storage
    storageProvider: {
      type: String,
      enum: ["local", "s3"],
      default: "local",
    },
    s3Config: {
      accessKeyId: { type: String, default: "" },
      secretAccessKey: { type: String, default: "" },
      region: { type: String, default: "" },
      bucket: { type: String, default: "" },
      endpoint: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export const Config =
  (mongoose.models?.Config as any) || mongoose.model("Config", configSchema);
