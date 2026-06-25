import mongoose from "mongoose";

const fieldSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    type: {
      type: String,
      enum: ["text", "number", "select", "time"],
      default: "text",
    },
    options: [{ type: String }], // for "select" type
    required: { type: Boolean, default: false },
    placeholder: { type: String, default: "" },
  },
  { _id: false }
);

const paymentMethodSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["cash", "card", "debit", "credit", "transfer", "pago-movil", "other"],
      required: true,
      unique: true,
    },
    label: { type: String, required: true },
    active: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    fields: {
      type: [fieldSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export const PaymentMethod =
  (mongoose.models?.PaymentMethod as any) || mongoose.model("PaymentMethod", paymentMethodSchema);

export const PAYMENT_METHOD_DEFAULTS: {
  type: string; label: string; sortOrder: number;
  fields: { key: string; label: string; type: string; options?: string[]; required: boolean; placeholder?: string }[];
}[] = [
  {
    type: "cash",
    label: "Cash",
    sortOrder: 0,
    fields: [
      { key: "amountReceived", label: "Amount received", type: "number", required: true, placeholder: "0.00" },
      { key: "currency", label: "Currency", type: "select", options: ["VES", "USD", "USDT"], required: true },
      { key: "change", label: "Change", type: "number", required: false, placeholder: "0.00" },
    ],
  },
  {
    type: "debit",
    label: "Debit Card",
    sortOrder: 1,
    fields: [
      { key: "reference", label: "Reference", type: "text", required: true, placeholder: "Transaction ref" },
      { key: "bank", label: "Bank", type: "text", required: true, placeholder: "Banco de Venezuela" },
      { key: "amount", label: "Amount", type: "number", required: true, placeholder: "0.00" },
      { key: "time", label: "Time", type: "time", required: true },
      { key: "payerId", label: "Payer ID", type: "text", required: false, placeholder: "V-12345678" },
    ],
  },
  {
    type: "credit",
    label: "Credit Card",
    sortOrder: 2,
    fields: [
      { key: "reference", label: "Reference", type: "text", required: true, placeholder: "Transaction ref" },
      { key: "bank", label: "Bank", type: "text", required: true, placeholder: "Mercantil" },
      { key: "cardBrand", label: "Card brand", type: "select", options: ["Visa", "Mastercard", "Amex", "Other"], required: true },
      { key: "authCode", label: "Auth code", type: "text", required: true, placeholder: "Authorization code" },
      { key: "amount", label: "Amount", type: "number", required: true, placeholder: "0.00" },
      { key: "payerId", label: "Payer ID", type: "text", required: false, placeholder: "V-12345678" },
    ],
  },
  {
    type: "transfer",
    label: "Transfer",
    sortOrder: 3,
    fields: [
      { key: "originAccount", label: "Origin account", type: "text", required: true, placeholder: "Account or ID" },
      { key: "destinationAccount", label: "Destination account", type: "text", required: true, placeholder: "Beneficiary account" },
      { key: "reference", label: "Reference", type: "text", required: true, placeholder: "Transfer ref" },
      { key: "amount", label: "Amount", type: "number", required: true, placeholder: "0.00" },
      { key: "bank", label: "Bank", type: "text", required: false, placeholder: "Origin bank" },
    ],
  },
  {
    type: "pago-movil",
    label: "Pago Móvil",
    sortOrder: 4,
    fields: [
      { key: "phone", label: "Phone", type: "text", required: true, placeholder: "0412-1234567" },
      { key: "bank", label: "Bank", type: "text", required: true, placeholder: "Banesco" },
      { key: "reference", label: "Reference", type: "text", required: true, placeholder: "Transaction ref" },
      { key: "amount", label: "Amount", type: "number", required: true, placeholder: "0.00" },
      { key: "payerId", label: "Payer ID", type: "text", required: false, placeholder: "V-12345678" },
    ],
  },
  {
    type: "invoice",
    label: "Invoice",
    sortOrder: 5,
    fields: [
      { key: "companyName", label: "Company name", type: "text", required: true, placeholder: "Razón social" },
      { key: "rif", label: "RIF", type: "text", required: true, placeholder: "J-12345678-9" },
      { key: "invoiceNumber", label: "Invoice number", type: "text", required: false, placeholder: "001-001" },
    ],
  },
];
