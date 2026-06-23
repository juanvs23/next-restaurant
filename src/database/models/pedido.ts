import mongoose from "mongoose";

const pedidoItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 1 },
    notes: { type: String },
  },
  { _id: false }
);

const pedidoSchema = new mongoose.Schema(
  {
    comandaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comanda",
      required: true,
    },
    items: [pedidoItemSchema],
    status: {
      type: String,
      enum: ["pending", "preparing", "ready", "served", "cancelled"],
      default: "pending",
    },
    notes: { type: String },
  },
  { timestamps: true }
);

pedidoSchema.index({ comandaId: 1, createdAt: -1 });

export const Pedido =
  (mongoose.models?.Pedido as any) || mongoose.model("Pedido", pedidoSchema);
