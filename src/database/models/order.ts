import mongoose from "mongoose";

const taxEntrySchema = new mongoose.Schema(
  {
    name: { type: String },
    rate: { type: Number },
    amount: { type: Number },
  },
  { _id: false }
);

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: { type: String },
    price: { type: Number },
    quantity: { type: Number, default: 1 },
    taxRate: { type: Number, default: 0 },
    taxBreakdown: [taxEntrySchema],
  },
  { _id: false }
);

const orderChargeSchema = new mongoose.Schema(
  {
    name: { type: String },
    type: { type: String, enum: ["percentage", "fixed"] },
    value: { type: Number },
    amount: { type: Number },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    comandaId: { type: mongoose.Schema.Types.ObjectId, ref: "Comanda" },
    pedidoIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pedido" }],

    tableLabel: { type: String },
    isDelivery: { type: Boolean, default: false },

    items: [orderItemSchema],

    // Legacy — kept for backward compat
    serviceCharge: { type: Number, default: 0 },
    deliveryCost: { type: Number, default: 0 },

    // Dynamic charges breakdown
    orderCharges: [orderChargeSchema],
    totalCharge: { type: Number, default: 0 },

    subtotal: { type: Number, default: 0 },
    totalTax: { type: Number, default: 0 },
    total: { type: Number, default: 0 },

    // Breakdown of global-scope taxes
    globalTaxBreakdown: [taxEntrySchema],

    source: {
      type: String,
      enum: ["backoffice", "frontend"],
      default: "backoffice",
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "preparing", "paid", "cancelled"],
      default: "pending",
    },
    paymentMethod: { type: String }, // Snapshot label (e.g. "Cash", "Tarjeta")
    paymentType: { type: String },   // Internal fixed type (cash|card|transfer|invoice|other)
    paymentData: { type: Map, of: String }, // Dynamic fields key-value
    invoiceNumber: { type: Number }, // Sequential invoice #
    customer: {
      name: { type: String },
      email: { type: String },
      phone: { type: String },
    },
    notes: { type: String },
    // Audit
    createdBy: { type: String },
    confirmedBy: { type: String },
    cashRegisterId: { type: mongoose.Schema.Types.ObjectId, ref: "CashRegister" },
    cashRegisterName: { type: String },

    // Currency snapshot at order time
    totalUsdRef: { type: Number },       // USD equivalent (BCV rate) when order was created
    exchangeRateBcv: { type: Number },   // BCV rate frozen at order creation
    exchangeRateUsdt: { type: Number },  // USDT rate frozen at order creation

    // Stripe payment tracking
    stripeSessionId: { type: String, index: true },
    stripePaymentIntentId: { type: String },
  },
  { timestamps: true }
);

orderSchema.index({ createdAt: -1 });

export const Order =
  (mongoose.models?.Order as any) || mongoose.model("Order", orderSchema);
