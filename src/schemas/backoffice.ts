import { z } from "zod";

// ── Users ──
export const createUserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(128),
  role: z.enum(["admin", "staff", "user"]).optional(),
  provider: z.enum(["credentials"]).optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).max(128).optional(),
  role: z.enum(["admin", "staff", "user"]).optional(),
  active: z.boolean().optional(),
});

// ── Frontend user registration ──
export const registerUserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(128),
});

// ── Products ──
export const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  price: z.number().positive(),
  categoryId: z.string().min(1),
  type: z.enum(["food", "drink", "dessert"]).optional(),
  images: z.array(z.string()).optional(),
  ingredients: z.array(z.string()).optional(),
  SKU: z.string().optional(),
  taxRate: z.number().min(0).max(1).optional(),
  taxIds: z.array(z.string()).optional(),
  available: z.boolean().optional(),
  featured: z.boolean().optional(),
});

export const updateProductSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  price: z.number().positive().optional(),
  categoryId: z.string().min(1).optional(),
  type: z.enum(["food", "drink", "dessert"]).optional(),
  images: z.array(z.string()).optional(),
  ingredients: z.array(z.string()).optional(),
  SKU: z.string().optional(),
  taxRate: z.number().min(0).max(1).optional(),
  taxIds: z.array(z.string()).optional(),
  available: z.boolean().optional(),
  featured: z.boolean().optional(),
});

// ── Orders ──
export const orderItemSchema = z.object({
  productId: z.string().optional(),
  name: z.string().min(1),
  price: z.number().nonnegative(),
  quantity: z.number().int().positive(),
});

export const createOrderSchema = z.object({
  comandaId: z.string().optional(),
  pedidoIds: z.array(z.string()).optional(),
  tableLabel: z.string().optional(),
  isDelivery: z.boolean().optional(),
  items: z.array(orderItemSchema).min(1),
  customer: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
  }).optional(),
  notes: z.string().optional(),
  orderCharges: z.array(z.object({
    name: z.string(),
    type: z.enum(["percentage", "fixed"]),
    value: z.number(),
    amount: z.number(),
  })).optional(),
  deliveryCost: z.number().nonnegative().optional(),
});

// ── Exchange Rate ──
export const exchangeRateSchema = z.object({
  exchangeRateBcv: z.number().min(0).optional(),
  exchangeRateUsdt: z.number().min(0).optional(),
});

// ── Config ──
export const updateConfigSchema = z.object({
  businessName: z.string().min(1).max(200).optional(),
  rif: z.string().optional(),
  businessAddress: z.string().optional(),
  businessPhone: z.string().optional(),
  businessEmail: z.string().email().optional(),
  taxRate: z.number().min(0).max(1).optional(),
  serviceChargeTaxable: z.boolean().optional(),
  serviceChargeRate: z.number().min(0).max(1).optional(),
  defaultDeliveryCost: z.number().min(0).optional(),
  defaultLanguage: z.enum(["es", "en", "pt"]).optional(),
  nonWorkingDays: z.array(z.number()).optional(),
  holidays: z.array(z.string()).optional(),
  timezone: z.string().optional(),
  nextInvoiceNumber: z.number().int().positive().optional(),
  exchangeRateBcv: z.number().min(0).optional(),
  exchangeRateUsdt: z.number().min(0).optional(),
  storageProvider: z.enum(["local", "s3"]).optional(),
  s3Config: z.object({
    accessKeyId: z.string().optional(),
    secretAccessKey: z.string().optional(),
    region: z.string().optional(),
    bucket: z.string().optional(),
    endpoint: z.string().optional(),
  }).optional(),
});

// ── Credit Notes ──
export const createCreditNoteSchema = z.object({
  originalOrderId: z.string().min(1),
  amount: z.number().positive(),
  reason: z.string().min(1).max(1000),
});

// ── Day Opening ──
export const createDayOpeningSchema = z.object({
  workShiftId: z.string().optional(),
  notes: z.string().max(500).optional(),
  exchangeRateBcv: z.number().min(0.01, "Exchange rate is required to open the day"),
});

// ── Cash Audit ──
export const createCashAuditSchema = z.object({
  workShiftId: z.string().optional(),
  declaredCash: z.number().min(0),
  notes: z.string().max(500).optional(),
});

// ── Bookings ──
export const createBookingSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  dateTime: z.string().min(1),
  turnTime: z.string().min(1),
  numberPersons: z.number().int().positive(),
  phone: z.string().optional(),
  specialRequests: z.string().optional(),
  tableId: z.string().optional(),
});

// ── Payment Methods ──
const paymentFieldSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  type: z.enum(["text", "number", "select", "time"]).optional(),
  options: z.array(z.string()).optional(),
  required: z.boolean().optional(),
  placeholder: z.string().optional(),
});

export const createPaymentMethodSchema = z.object({
  type: z.enum(["cash", "card", "debit", "credit", "transfer", "pago-movil", "other"]),
  label: z.string().min(1).max(100),
  active: z.boolean().optional(),
  sortOrder: z.number().int().nonnegative().optional(),
  fields: z.array(paymentFieldSchema).optional(),
});

export const updatePaymentMethodSchema = z.object({
  type: z.enum(["cash", "card", "debit", "credit", "transfer", "pago-movil", "other"]).optional(),
  label: z.string().min(1).max(100).optional(),
  active: z.boolean().optional(),
  sortOrder: z.number().int().nonnegative().optional(),
  fields: z.array(paymentFieldSchema).optional(),
});

// ── Media ──
export const createMediaSchema = z.object({
  filename: z.string().min(1),
  url: z.string(),
  mimeType: z.string().optional(),
  size: z.number().nonnegative().optional(),
  alt: z.string().optional(),
  title: z.string().optional(),
  categories: z.array(z.string()).optional(),
});

export const updateMediaSchema = z.object({
  filename: z.string().min(1).optional(),
  url: z.string().optional(),
  mimeType: z.string().optional(),
  size: z.number().nonnegative().optional(),
  alt: z.string().optional(),
  title: z.string().optional(),
  categories: z.array(z.string()).optional(),
});

// ── Close Day (Reports) ──
export const closeDaySchema = z.object({
  date: z.string().optional(),
});

// ── Turns ──
export const createTurnSchema = z.object({
  name: z.string().min(1).max(100),
  label: z.string().min(1).max(100),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  sortOrder: z.number().int().nonnegative().optional(),
  active: z.boolean().optional(),
  color: z.string().optional(),
});
export const updateTurnSchema = createTurnSchema.partial();

// ── Work Shifts ──
export const createWorkShiftSchema = z.object({
  name: z.string().min(1).max(100),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  active: z.boolean().optional(),
  sortOrder: z.number().int().nonnegative().optional(),
});
export const updateWorkShiftSchema = createWorkShiftSchema.partial();

// ── Taxes ──
export const createTaxSchema = z.object({
  name: z.string().min(1).max(100),
  rate: z.number().min(0).max(1),
  scope: z.enum(["product", "global"]),
  categoryIds: z.array(z.string()).optional(),
  applyToServiceCharge: z.boolean().optional(),
  applyToDelivery: z.boolean().optional(),
  active: z.boolean().optional(),
});
export const updateTaxSchema = createTaxSchema.partial();

// ── Tables ──
export const createTableSchema = z.object({
  tableId: z.string().min(1).max(50),
  name: z.string().optional(),
  capacity: z.number().int().positive(),
  location: z.string().optional(),
  status: z.enum(["available", "occupied", "reserved", "maintenance"]).optional(),
});
export const updateTableSchema = createTableSchema.partial();

// ── Payments ──
export const createPaymentSchema = z.object({
  orderId: z.string().min(1),
  method: z.enum(["cash", "card", "transfer", "invoice"]),
  amount: z.number().positive(),
  status: z.enum(["pending", "paid", "refunded"]).optional(),
  reference: z.string().optional(),
  cardLast4: z.string().optional(),
  notes: z.string().optional(),
  paidAt: z.string().optional(),
  createdBy: z.string().optional(),
});

// ── Pedidos ──
const pedidoItemSchema = z.object({
  productId: z.string().optional(),
  name: z.string().min(1),
  price: z.number().nonnegative(),
  quantity: z.number().int().positive().optional(),
  notes: z.string().optional(),
});
export const createPedidoSchema = z.object({
  comandaId: z.string().min(1),
  items: z.array(pedidoItemSchema).optional(),
  status: z.enum(["pending", "preparing", "ready", "served", "cancelled"]).optional(),
  notes: z.string().optional(),
});

// ── Charges ──
export const createChargeSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(["percentage", "fixed"]),
  value: z.number().nonnegative(),
  scope: z.enum(["product", "global"]),
  categoryIds: z.array(z.string()).optional(),
  applyTo: z.array(z.string()).optional(),
  appliesToDelivery: z.boolean().optional(),
  active: z.boolean().optional(),
});
export const updateChargeSchema = createChargeSchema.partial();

// ── Cash Registers ──
export const createCashRegisterSchema = z.object({
  name: z.string().min(1).max(100),
  active: z.boolean().optional(),
  sortOrder: z.number().int().nonnegative().optional(),
});
export const updateCashRegisterSchema = createCashRegisterSchema.partial();

// ── Comandas ──
export const createComandaSchema = z.object({
  tableId: z.string().optional(),
  tableLabel: z.string().optional(),
  isDelivery: z.boolean().optional(),
  customerName: z.string().optional(),
});

// ── Categories ──
export const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  image: z.string().optional(),
  items: z.array(z.string()).optional(),
});
export const updateCategorySchema = createCategorySchema.partial();

// ── Booking (update via PUT) ──
export const updateBookingSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  dateTime: z.string().optional(),
  turnTime: z.string().optional(),
  numberPersons: z.number().int().positive().optional(),
  phone: z.string().optional(),
  comments: z.string().optional(),
  tableId: z.string().optional(),
  status: z.enum(["pending", "confirmed", "rescheduled", "cancelled", "completed"]).optional(),
});

// ── Order status update (PATCH) ──
export const updateOrderStatusSchema = z.object({
  status: z.enum(["pending", "paid", "cancelled"]).optional(),
  items: z.array(orderItemSchema).optional(),
  subtotal: z.number().optional(),
  total: z.number().optional(),
  customer: z.object({
    name: z.string().optional(),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().optional(),
  }).optional(),
  paymentMethod: z.string().optional(),
  paymentType: z.string().optional(),
  paymentData: z.record(z.string()).optional(),
  notes: z.string().optional(),
  confirmedBy: z.string().optional(),
  invoiceNumber: z.number().optional(),
});

// ── Comanda (update via PATCH) ──
export const updateComandaSchema = z.object({
  tableId: z.string().optional(),
  tableLabel: z.string().optional(),
  isDelivery: z.boolean().optional(),
  customerName: z.string().optional(),
  status: z.enum(["open", "closed", "rejected"]).optional(),
});

// ── Pedido (update via PATCH) ──
export const updatePedidoSchema = z.object({
  status: z.enum(["pending", "preparing", "ready", "served", "cancelled"]).optional(),
  items: z.array(pedidoItemSchema).optional(),
  notes: z.string().optional(),
});
