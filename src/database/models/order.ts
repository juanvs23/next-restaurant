import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: { type: String },
    price: { type: Number },
    quantity: { type: Number, default: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    // Related comanda and pedidos
    comandaId: { type: mongoose.Schema.Types.ObjectId, ref: "Comanda" },
    pedidoIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pedido" }],

    // Table / delivery info (snapshot from comanda)
    tableLabel: { type: String },
    isDelivery: { type: Boolean, default: false },

    // Items consolidated from pedidos
    items: [orderItemSchema],

    // Charges
    serviceCharge: { type: Number, default: 0 },   // 10% if mesa
    deliveryCost: { type: Number, default: 0 },     // variable if delivery
    subtotal: { type: Number, default: 0 },
    total: { type: Number, default: 0 },

    // Billing
    status: {
      type: String,
      enum: ["pending", "paid", "cancelled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "transfer", "invoice"],
    },
    customer: {
      name: { type: String },
      email: { type: String },
      phone: { type: String },
    },
    notes: { type: String },
  },
  { timestamps: true }
);

orderSchema.index({ createdAt: -1 });

export const Order =
  (mongoose.models?.Order as any) || mongoose.model("Order", orderSchema);
