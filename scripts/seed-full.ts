import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { slugify } from "../src/utils/slugify";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/gericht";
const DB_NAME = process.env.DB_NAME || "gericht";

const CATEGORIES = [
  { name: "Entradas", description: "Starters and appetizers", image: "/uploads/food/eggs.jpg" },
  { name: "Sopas", description: "Soups and creams", image: "/uploads/food/soup.jpg" },
  { name: "Ensaladas", description: "Fresh salads", image: "/uploads/food/salad.jpg" },
  { name: "Platos Principales", description: "Main courses", image: "/uploads/food/steak.jpg" },
  { name: "Pastas", description: "Pasta dishes", image: "/uploads/food/pizza.jpg" },
  { name: "Carnes", description: "Grilled meats", image: "/uploads/food/meat.jpg" },
  { name: "Pescados & Mariscos", description: "Seafood specialties", image: "/uploads/food/salmon.jpg" },
  { name: "Postres", description: "Desserts", image: "/uploads/food/eggs.jpg" },
  { name: "Bebidas", description: "Drinks and beverages", image: "/uploads/food/tacos.jpg" },
  { name: "Panadería", description: "Fresh bakery", image: "/uploads/food/eggs.jpg" },
];

const ALL_IMAGES = [
  "/uploads/food/soup.jpg", "/uploads/food/steak.jpg", "/uploads/food/salmon.jpg",
  "/uploads/food/meat.jpg", "/uploads/food/salad.jpg", "/uploads/food/tacos.jpg",
  "/uploads/food/eggs.jpg", "/uploads/food/pizza.jpg",
];

function imgSet(...indices: number[]): string[] {
  return indices.map((i) => ALL_IMAGES[i]);
}

const PRODUCTS: {
  name: string; description: string; price: number;
  category: string; type: "food" | "drink" | "dessert";
  images: string[]; ingredients: string[];
  featured?: boolean;
}[] = [
  // Entradas (4)
  // imgSet indices: 0=soup, 1=steak, 2=salmon, 3=meat, 4=salad, 5=tacos, 6=eggs, 7=pizza
  // Entradas (4)
  { name: "Bruschetta Clásica", description: "Pan tostado con tomate, albahaca fresca y aceite de oliva extra virgen", price: 8.5, category: "Entradas", type: "food", images: imgSet(6, 3, 4, 0, 5, 7), ingredients: ["Pan artesanal", "Tomate", "Albahaca", "Aceite de oliva", "Ajo"], featured: true },
  { name: "Carpaccio de Res", description: "Finas láminas de res con parmesano, rúcula y vinagreta de limón", price: 14.0, category: "Entradas", type: "food", images: imgSet(3, 1, 2, 4, 6, 0), ingredients: ["Lomo de res", "Parmesano", "Rúcula", "Limón", "Aceite de oliva"] },
  { name: "Croquetas de Jamón", description: "Croquetas cremosas de jamón serrano con bechamel", price: 9.0, category: "Entradas", type: "food", images: imgSet(6, 4, 7, 5, 0, 3), ingredients: ["Jamón serrano", "Harina", "Leche", "Mantequilla", "Huevo"] },
  { name: "Hummus con Pita", description: "Puré de garbanzos con tahini, aceite de oliva y pan pita tostado", price: 7.0, category: "Entradas", type: "food", images: imgSet(5, 4, 6, 7, 0, 2), ingredients: ["Garbanzos", "Tahini", "Aceite de oliva", "Limón", "Pan pita"] },
  // Sopas (2)
  { name: "Crema de Calabaza", description: "Crema suave de calabaza asada con jengibre y croutons", price: 9.5, category: "Sopas", type: "food", images: imgSet(0, 6, 4, 5, 7, 3), ingredients: ["Calabaza", "Jengibre", "Crema de leche", "Croutons", "Nuez moscada"], featured: true },
  { name: "Sopa de Cebolla Gratinada", description: "Sopa de cebolla clásica con queso gratinado y croutons", price: 10.0, category: "Sopas", type: "food", images: imgSet(0, 7, 3, 1, 4, 6), ingredients: ["Cebolla", "Caldo de res", "Queso gruyère", "Pan", "Tomillo"] },
  // Ensaladas (3)
  { name: "Ensalada César", description: "Lechuga romana, croutones, parmesano y aderezo César", price: 11.0, category: "Ensaladas", type: "food", images: imgSet(4, 0, 5, 6, 7, 2), ingredients: ["Lechuga romana", "Croutones", "Parmesano", "Aderezo César", "Pollo"], featured: true },
  { name: "Ensalada Griega", description: "Tomate, pepino, aceitunas, queso feta y orégano", price: 10.5, category: "Ensaladas", type: "food", images: imgSet(4, 6, 0, 7, 5, 1), ingredients: ["Tomate", "Pepino", "Aceitunas", "Queso feta", "Orégano"] },
  { name: "Ensalada de Palta", description: "Palta, mango, camarones y vinagreta de maracuyá", price: 13.5, category: "Ensaladas", type: "food", images: imgSet(4, 2, 5, 6, 7, 0), ingredients: ["Palta", "Mango", "Camarones", "Maracuyá", "Mix de hojas"] },
  // Platos Principales (3)
  { name: "Risotto al Funghi", description: "Risotto cremoso con mix de hongos silvestres y parmesano", price: 18.0, category: "Platos Principales", type: "food", images: imgSet(1, 3, 2, 4, 0, 7), ingredients: ["Arroz arbóreo", "Hongos silvestres", "Parmesano", "Vino blanco", "Caldo de verduras"], featured: true },
  { name: "Pollo al Curry", description: "Pollo tierno en salsa curry con leche de coco y arroz basmati", price: 16.5, category: "Platos Principales", type: "food", images: imgSet(1, 5, 4, 6, 7, 0), ingredients: ["Pollo", "Curry", "Leche de coco", "Arroz basmati", "Cilantro"] },
  { name: "Lomo Saltado", description: "Tiras de lomo salteadas con cebolla, tomate y papas fritas", price: 19.0, category: "Platos Principales", type: "food", images: imgSet(1, 3, 2, 5, 4, 6), ingredients: ["Lomo de res", "Cebolla", "Tomate", "Papas", "Salsa de soya"] },
  // Pastas (3)
  { name: "Spaghetti Carbonara", description: "Spaghetti con salsa carbonara tradicional, panceta y yema de huevo", price: 15.0, category: "Pastas", type: "food", images: imgSet(7, 3, 1, 4, 6, 0), ingredients: ["Spaghetti", "Panceta", "Huevo", "Parmesano", "Pimienta negra"] },
  { name: "Lasagna Bolognese", description: "Lasagna clásica con ragú de res, bechamel y queso gratinado", price: 17.0, category: "Pastas", type: "food", images: imgSet(7, 1, 3, 2, 5, 4), ingredients: ["Pasta de lasagna", "Carne molida", "Bechamel", "Queso mozzarella", "Tomate"] },
  { name: "Fettuccine Alfredo", description: "Fettuccine en cremosa salsa Alfredo con pollo y champiñones", price: 16.0, category: "Pastas", type: "food", images: imgSet(7, 6, 4, 0, 3, 5), ingredients: ["Fettuccine", "Crema de leche", "Pollo", "Champiñones", "Parmesano"] },
  // Carnes (3)
  { name: "Steck Medium Rare", description: "Filete de res 300g sellado con mantequilla, romero y ajo", price: 32.0, category: "Carnes", type: "food", images: imgSet(1, 3, 2, 4, 5, 7), ingredients: ["Filete de res", "Mantequilla", "Romero", "Ajo", "Sal marina"], featured: true },
  { name: "Costillas BBQ", description: "Costillas de cerdo glaseadas con salsa BBQ ahumada", price: 26.0, category: "Carnes", type: "food", images: imgSet(3, 1, 5, 7, 0, 6), ingredients: ["Costillas de cerdo", "Salsa BBQ", "Miel", "Especias", "Papas fritas"] },
  { name: "Cordero al Horno", description: "Pierna de cordero asada con hierbas provenzales y papas", price: 34.0, category: "Carnes", type: "food", images: imgSet(3, 2, 1, 4, 7, 0), ingredients: ["Pierna de cordero", "Hierbas provenzales", "Papas", "Ajo", "Vino tinto"] },
  // Pescados & Mariscos (3)
  { name: "Salmón Glaseado", description: "Salmón glaseado con miel y mostaza, servido con espárragos", price: 24.0, category: "Pescados & Mariscos", type: "food", images: imgSet(2, 4, 0, 5, 7, 1), ingredients: ["Salmón", "Miel", "Mostaza", "Espárragos", "Limón"], featured: true },
  { name: "Paella de Mariscos", description: "Paella valenciana con camarones, mejillones, calamares y azafrán", price: 27.0, category: "Pescados & Mariscos", type: "food", images: imgSet(2, 1, 3, 4, 6, 7), ingredients: ["Arroz", "Camarones", "Mejillones", "Calamares", "Azafrán"] },
  { name: "Ceviche Clásico", description: "Pescado fresco marinado en limón con cebolla morada y camote", price: 15.0, category: "Pescados & Mariscos", type: "food", images: imgSet(2, 5, 4, 0, 6, 3), ingredients: ["Pescado blanco", "Limón", "Cebolla morada", "Camote", "Choclo"] },
  // Postres (3)
  { name: "Tiramisú Clásico", description: "Tiramisú tradicional con mascarpone, café y cacao", price: 9.0, category: "Postres", type: "dessert", images: imgSet(6, 7, 4, 5, 0, 2), ingredients: ["Mascarpone", "Café", "Cacao", "Bizcochos", "Huevo"], featured: true },
  { name: "Cheesecake New York", description: "Cheesecake cremoso con base de galleta y coulis de frutos rojos", price: 10.0, category: "Postres", type: "dessert", images: imgSet(6, 4, 5, 7, 3, 1), ingredients: ["Queso crema", "Galleta", "Frutos rojos", "Crema", "Vainilla"] },
  { name: "Crème Brûlée", description: "Crema de vainilla caramelizada con azúcar quemado", price: 8.5, category: "Postres", type: "dessert", images: imgSet(6, 0, 4, 7, 5, 2), ingredients: ["Crema de leche", "Vainilla", "Huevo", "Azúcar", "Caramelo"] },
  // Bebidas (3)
  { name: "Limonada Natural", description: "Limonada fresca con hierbabuena y jengibre", price: 4.5, category: "Bebidas", type: "drink", images: imgSet(5, 0, 4, 6, 7, 2), ingredients: ["Limón", "Hierbabuena", "Jengibre", "Agua", "Azúcar"] },
  { name: "Café Espresso", description: "Espresso doble de granos arábica tostado oscuro", price: 3.0, category: "Bebidas", type: "drink", images: imgSet(5, 7, 4, 6, 1, 0), ingredients: ["Café arábica", "Agua mineral"] },
  { name: "Cóctel de la Casa", description: "Cóctel signature con ron, frutas tropicales y hierbabuena", price: 8.0, category: "Bebidas", type: "drink", images: imgSet(5, 2, 0, 6, 7, 4), ingredients: ["Ron", "Frutos tropicales", "Hierbabuena", "Limón", "Hielo"] },
  // Panadería (3)
  { name: "Pan Artesanal de Masa Madre", description: "Pan de masa madre horneado diariamente con harina orgánica", price: 5.0, category: "Panadería", type: "food", images: imgSet(6, 4, 0, 5, 7, 3), ingredients: ["Harina orgánica", "Agua", "Sal", "Masa madre"] },
  { name: "Croissant de Mantequilla", description: "Croissant hojaldrado de mantequilla francés", price: 4.5, category: "Panadería", type: "food", images: imgSet(6, 7, 4, 0, 5, 2), ingredients: ["Mantequilla", "Harina", "Leche", "Huevo", "Levadura"] },
  { name: "Focaccia de Romero", description: "Focaccia italiana con romero fresco, sal marina y aceite de oliva", price: 6.0, category: "Panadería", type: "food", images: imgSet(6, 0, 4, 7, 5, 1), ingredients: ["Harina", "Romero fresco", "Sal marina", "Aceite de oliva", "Tomate cherry"] },
];

const TABLES = [
  { tableId: "T01", name: "Mesa 1", capacity: 2, location: "ventana" },
  { tableId: "T02", name: "Mesa 2", capacity: 2, location: "ventana" },
  { tableId: "T03", name: "Mesa 3", capacity: 4, location: "central" },
  { tableId: "T04", name: "Mesa 4", capacity: 4, location: "central" },
  { tableId: "T05", name: "Mesa 5", capacity: 6, location: "central" },
  { tableId: "T06", name: "Mesa 6", capacity: 6, location: "terraza" },
  { tableId: "T07", name: "Mesa 7", capacity: 4, location: "terraza" },
  { tableId: "T08", name: "Mesa 8", capacity: 8, location: "privado" },
  { tableId: "T09", name: "Mesa 9", capacity: 10, location: "privado" },
  { tableId: "T10", name: "Mesa 10", capacity: 4, location: "barra" },
  { tableId: "T11", name: "Mesa 11", capacity: 2, location: "barra" },
  { tableId: "T12", name: "Mesa 12", capacity: 4, location: "terraza" },
];

const CUSTOMERS = [
  "María García", "Carlos Rodríguez", "Ana Martínez", "Luis Hernández",
  "Laura González", "Pedro Sánchez", "Sofía López", "Diego Ramírez",
  "Valentina Torres", "Andrés Silva", "Camila Rojas", "Mateo Castillo",
  "Isabella Ortiz", "Sebastián Mendoza", "Gabriela Navarro",
];

function getWorkingDays(count: number): string[] {
  const days: string[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let d = new Date(today);
  d.setDate(d.getDate() - (count - 1));
  while (days.length < count) {
    if (d.getDay() !== 0) days.push(d.toISOString().split("T")[0]);
    d.setDate(d.getDate() + 1);
  }
  return days;
}

function pickRandom<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min: number, max: number): number { return Math.floor(Math.random() * (max - min + 1)) + min; }
function formatDate(dateStr: string, hour: number, min: number): Date {
  return new Date(`${dateStr}T${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}:00-04:00`);
}

async function main() {
  await mongoose.connect(MONGO_URI, { dbName: DB_NAME });
  const db = mongoose.connection.db!;
  console.log(`📦 Conectado a ${MONGO_URI}/${DB_NAME}`);

  // Preserve users, drop everything else
  const users = await db.collection("users").find().toArray();
  const collections = await db.listCollections().toArray();
  for (const col of collections) {
    if (col.name !== "users") await db.collection(col.name).deleteMany({});
  }
  console.log(`🧹 Colecciones limpiadas (${users.length} usuarios preservados)`);

  // 2. Config
  await db.collection("configs").insertOne({
    businessName: "GERÍCHT", rif: "J-12345678-9",
    businessAddress: "Av. Principal, Caracas, Venezuela",
    businessPhone: "+58 212-555-0100", businessEmail: "info@gericht.com",
    taxRate: 0.16, serviceChargeRate: 0.10, serviceChargeTaxable: true,
    defaultDeliveryCost: 5,
    paymentMethods: ["cash", "card", "debit", "credit", "transfer", "pago-movil", "invoice"],
    nonWorkingDays: [0], holidays: [], defaultLanguage: "es",
    timezone: "-04:00", exchangeRateBcv: 60, exchangeRateUsdt: 62, nextInvoiceNumber: 1, nextCreditNoteNumber: 1,
    storageProvider: "local",
    s3Config: { accessKeyId: "", secretAccessKey: "", region: "", bucket: "", endpoint: "" },
    createdAt: new Date(), updatedAt: new Date(),
  });
  console.log("✅ Configuración creada");

  // 3. Turns
  const [lunchId, dinnerId] = [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()];
  await db.collection("turns").insertMany([
    { _id: lunchId, name: "Lunch", label: "Almuerzo", startTime: "12:00", endTime: "15:00", sortOrder: 0, active: true, color: "#DCCA87", createdAt: new Date(), updatedAt: new Date() },
    { _id: dinnerId, name: "Dinner", label: "Cena", startTime: "18:00", endTime: "22:00", sortOrder: 1, active: true, color: "#0C0C0C", createdAt: new Date(), updatedAt: new Date() },
  ]);
  console.log("✅ Turnos creados");

  // 4. Work shifts
  const [morningId, afternoonId] = [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()];
  await db.collection("workshifts").insertMany([
    { _id: morningId, name: "Mañana", startTime: "08:00", endTime: "15:00", active: true, sortOrder: 0, createdAt: new Date(), updatedAt: new Date() },
    { _id: afternoonId, name: "Tarde", startTime: "15:00", endTime: "22:00", active: true, sortOrder: 1, createdAt: new Date(), updatedAt: new Date() },
  ]);
  console.log("✅ Turnos de trabajo creados");

  // 5. Taxes
  const ivaId = new mongoose.Types.ObjectId();
  await db.collection("taxes").insertMany([
    { _id: ivaId, name: "IVA 16%", rate: 0.16, scope: "global", active: true, applyToServiceCharge: true, applyToDelivery: false, categoryIds: [], createdAt: new Date(), updatedAt: new Date() },
  ]);
  console.log("✅ Impuestos creados");

  // 6. Charges
  await db.collection("charges").insertOne({ name: "Servicio 10%", type: "percentage", value: 10, scope: "global", applyTo: ["subtotal"], appliesToDelivery: false, active: true, createdAt: new Date(), updatedAt: new Date() });
  console.log("✅ Cargos creados");

  // 7. Payment methods
  const methodDefs = [
    { type: "cash", label: "Cash", sortOrder: 0, fields: [{ key: "amountReceived", label: "Amount received", type: "number", required: true, placeholder: "0.00" }, { key: "currency", label: "Currency", type: "select", options: ["VES", "USD", "USDT"], required: true }, { key: "change", label: "Change", type: "number", required: false, placeholder: "0.00" }] },
    { type: "debit", label: "Debit Card", sortOrder: 1, fields: [{ key: "reference", label: "Reference", type: "text", required: true, placeholder: "Transaction ref" }, { key: "bank", label: "Bank", type: "text", required: true, placeholder: "Banco de Venezuela" }, { key: "amount", label: "Amount", type: "number", required: true, placeholder: "0.00" }, { key: "time", label: "Time", type: "time", required: true }, { key: "payerId", label: "Payer ID", type: "text", required: false, placeholder: "V-12345678" }] },
    { type: "credit", label: "Credit Card", sortOrder: 2, fields: [{ key: "reference", label: "Reference", type: "text", required: true, placeholder: "Transaction ref" }, { key: "bank", label: "Bank", type: "text", required: true, placeholder: "Mercantil" }, { key: "cardBrand", label: "Card brand", type: "select", options: ["Visa", "Mastercard", "Amex", "Other"], required: true }, { key: "authCode", label: "Auth code", type: "text", required: true, placeholder: "Authorization code" }, { key: "amount", label: "Amount", type: "number", required: true, placeholder: "0.00" }, { key: "payerId", label: "Payer ID", type: "text", required: false, placeholder: "V-12345678" }] },
    { type: "transfer", label: "Transfer", sortOrder: 3, fields: [{ key: "originAccount", label: "Origin account", type: "text", required: true, placeholder: "Account or ID" }, { key: "destinationAccount", label: "Destination account", type: "text", required: true, placeholder: "Beneficiary account" }, { key: "reference", label: "Reference", type: "text", required: true, placeholder: "Transfer ref" }, { key: "amount", label: "Amount", type: "number", required: true, placeholder: "0.00" }, { key: "bank", label: "Bank", type: "text", required: false, placeholder: "Origin bank" }] },
    { type: "pago-movil", label: "Pago Móvil", sortOrder: 4, fields: [{ key: "phone", label: "Phone", type: "text", required: true, placeholder: "0412-1234567" }, { key: "bank", label: "Bank", type: "text", required: true, placeholder: "Banesco" }, { key: "reference", label: "Reference", type: "text", required: true, placeholder: "Transaction ref" }, { key: "amount", label: "Amount", type: "number", required: true, placeholder: "0.00" }, { key: "payerId", label: "Payer ID", type: "text", required: false, placeholder: "V-12345678" }] },
    { type: "invoice", label: "Invoice", sortOrder: 5, fields: [{ key: "companyName", label: "Company name", type: "text", required: true, placeholder: "Razón social" }, { key: "rif", label: "RIF", type: "text", required: true, placeholder: "J-12345678-9" }, { key: "invoiceNumber", label: "Invoice number", type: "text", required: false, placeholder: "001-001" }] },
  ];
  await db.collection("paymentmethods").insertMany(methodDefs.map(m => ({ ...m, active: true, createdAt: new Date(), updatedAt: new Date() })));
  console.log("✅ Métodos de pago creados");

  // 8. Categories + Products
  const categoryMap = new Map<string, mongoose.Types.ObjectId>();
  for (const cat of CATEGORIES) {
    const id = new mongoose.Types.ObjectId();
    categoryMap.set(cat.name, id);
    await db.collection("categories").insertOne({ _id: id, name: cat.name, description: cat.description, image: cat.image, items: [], createdAt: new Date(), updatedAt: new Date() });
  }
  console.log(`✅ ${CATEGORIES.length} categorías creadas con imágenes`);

  let skuCounter = 1;
  const usedSlugs = new Set<string>();
  for (const prod of PRODUCTS) {
    const catId = categoryMap.get(prod.category)!;
    const productId = new mongoose.Types.ObjectId();
    let slug = slugify(prod.name);
    // Ensure unique slug by appending counter if collision
    if (usedSlugs.has(slug)) {
      let counter = 1;
      while (usedSlugs.has(`${slug}-${counter}`)) counter++;
      slug = `${slug}-${counter}`;
    }
    usedSlugs.add(slug);
    await db.collection("products").insertOne({
      _id: productId, name: prod.name, description: prod.description,
      price: prod.price, categoryId: catId, type: prod.type,
      images: prod.images, ingredients: prod.ingredients,
      slug, featured: prod.featured ?? false,
      SKU: `SKU-${String(skuCounter).padStart(4, "0")}`,
      taxRate: 0.16, taxIds: [], available: true,
      createdAt: new Date(), updatedAt: new Date(),
    });
    await db.collection("categories").updateOne({ _id: catId }, { $push: { items: productId } } as any);
    skuCounter++;
  }
  console.log(`✅ ${PRODUCTS.length} productos creados con imágenes`);

  // 9. Tables
  const tableIds: mongoose.Types.ObjectId[] = [];
  for (const t of TABLES) {
    const id = new mongoose.Types.ObjectId();
    tableIds.push(id);
    await db.collection("tables").insertOne({ _id: id, tableId: t.tableId, name: t.name, capacity: t.capacity, location: t.location, status: "available", createdAt: new Date(), updatedAt: new Date() });
  }
  console.log(`✅ ${TABLES.length} mesas creadas`);

  // 10. Bookings
  const bookingData = [];
  for (let i = 0; i < 20; i++) {
    const daysAgo = randInt(-30, 30);
    const d = new Date();
    d.setDate(d.getDate() + daysAgo);
    d.setHours(randInt(12, 21), randInt(0, 59), 0, 0);
    bookingData.push({
      firstName: pickRandom(CUSTOMERS).split(" ")[0],
      lastName: pickRandom(CUSTOMERS).split(" ")[1] || "",
      email: `guest${i}@email.com`,
      phone: `+58 412-${String(randInt(1000000, 9999999))}`,
      dateTime: d,
      turnTime: d.getHours() < 15 ? "12:00-15:00" : "18:00-22:00",
      numberPersons: randInt(1, 8),
      tableId: pickRandom(tableIds),
      status: daysAgo < -3 ? "completed" : daysAgo < 0 ? "confirmed" : pickRandom(["pending", "confirmed"]),
      createdAt: new Date(), updatedAt: new Date(),
    });
  }
  await db.collection("bookings").insertMany(bookingData);
  console.log(`✅ ${bookingData.length} reservas creadas`);

  // 11. Two weeks of operations
  const workingDays = getWorkingDays(14);
  const todayStr = new Date().toISOString().split("T")[0];
  const yesterdayD = new Date(); yesterdayD.setDate(yesterdayD.getDate() - 1);
  const yesterdayStr = yesterdayD.toISOString().split("T")[0];
  const allProducts = await db.collection("products").find().toArray();
  const pms = ["cash", "debit", "credit", "transfer", "pago-movil"];
  const pmLabels: Record<string, string> = { cash: "Cash", debit: "Debit Card", credit: "Credit Card", transfer: "Transfer", "pago-movil": "Pago Móvil" };
  let invoiceNum = 1;

  for (let dayIdx = 0; dayIdx < workingDays.length; dayIdx++) {
    const dateStr = workingDays[dayIdx];
    const isToday = dateStr === todayStr;
    const isYesterday = dateStr === yesterdayStr;
    const shouldClose = !isToday && !isYesterday && dateStr < todayStr;
    const ordersPerDay = randInt(isToday || isYesterday ? 3 : 4, isToday || isYesterday ? 6 : 10);

    await db.collection("dayopenings").insertOne({ date: dateStr, openedBy: "Admin GERÍCHT", openedAt: formatDate(dateStr, 8, 0), workShiftId: morningId, notes: "Apertura automática (seed)", createdAt: new Date(), updatedAt: new Date() });

    const orderDocs: any[] = [];

    for (let oi = 0; oi < ordersPerDay; oi++) {
      const hour = randInt(11, 21);
      const min = randInt(0, 59);
      const createdAt = formatDate(dateStr, hour, min);
      const tableId = pickRandom(tableIds);
      const table = TABLES[tableIds.indexOf(tableId)] || TABLES[0];

      const comandaId = new mongoose.Types.ObjectId();
      const customer = pickRandom(CUSTOMERS);
      await db.collection("comandas").insertOne({ _id: comandaId, tableId, tableLabel: table.name, isDelivery: false, customerName: customer, status: shouldClose ? "closed" : pickRandom(["open", "closed"]), createdAt, updatedAt: createdAt });

      const numItems = randInt(2, 5);
      const selectedProducts = [...allProducts].sort(() => Math.random() - 0.5).slice(0, numItems);
      const pedidoIds: mongoose.Types.ObjectId[] = [];

      for (let pi = 0; pi < Math.min(2, Math.ceil(numItems / 2)); pi++) {
        const pedidoId = new mongoose.Types.ObjectId();
        pedidoIds.push(pedidoId);
        const items = selectedProducts.slice(pi * 2, (pi + 1) * 2).map((p: any) => ({ productId: p._id, name: p.name, price: p.price, quantity: randInt(1, 3), notes: "" }));
        await db.collection("pedidos").insertOne({ _id: pedidoId, comandaId, items, status: shouldClose ? "served" : pickRandom(["pending", "preparing", "ready", "served"]), createdAt, updatedAt: createdAt });
      }

      let subtotal = 0;
      const orderItems = selectedProducts.map((p: any) => {
        const qty = randInt(1, 3);
        subtotal += p.price * qty;
        return { productId: p._id, name: p.name, price: p.price, quantity: qty, taxBreakdown: [{ name: "IVA 16%", rate: 0.16, amount: Math.round(p.price * qty * 0.16 * 100) / 100 }] };
      });

      const chargeAmount = Math.round(subtotal * 0.1 * 100) / 100;
      const totalTax = Math.round((subtotal + chargeAmount) * 0.16 * 100) / 100;
      const totalUsd = Math.round((subtotal + chargeAmount + totalTax) * 100) / 100;
      const rate = 60; // BCV rate from Config seed

      const toVes = (usd: number) => Math.round(usd * rate * 100) / 100;

      const isPaid = shouldClose || Math.random() > 0.3;
      const pm = pickRandom(pms);

      if (isPaid && !isToday) {
        orderDocs.push({ comandaId, pedidoIds, tableLabel: table.name, isDelivery: false, source: "backoffice", items: orderItems, serviceCharge: toVes(chargeAmount), deliveryCost: 0, orderCharges: [{ name: "Servicio 10%", type: "percentage", value: 10, amount: toVes(chargeAmount) }], totalCharge: toVes(chargeAmount), subtotal: toVes(subtotal), totalTax: toVes(totalTax), total: toVes(totalUsd), totalUsdRef: totalUsd, exchangeRateBcv: rate, globalTaxBreakdown: [{ name: "IVA 16%", rate: 0.16, amount: toVes(totalTax) }], status: "paid", paymentMethod: pmLabels[pm], paymentType: pm, paymentData: { amountReceived: String(toVes(totalUsd) + randInt(0, 20)) }, invoiceNumber: invoiceNum++, customer: { name: customer }, notes: "", createdBy: "Admin GERÍCHT", confirmedBy: "Admin GERÍCHT", createdAt, updatedAt: new Date(createdAt.getTime() + randInt(30, 120) * 60000) });
      }
    }

    if (orderDocs.length > 0) await db.collection("orders").insertMany(orderDocs);

    if (shouldClose) {
      const cashOrders = orderDocs.filter((o: any) => o.paymentType === "cash");
      const expectedCash = cashOrders.reduce((s: number, o: any) => s + o.total, 0);
      await db.collection("cashaudits").insertOne({ date: dateStr, workShiftId: afternoonId, workShiftName: "Tarde", expectedCash, declaredCash: expectedCash + randInt(-10, 10), difference: 0, notes: "Arqueo automático (seed)", createdBy: "Admin GERÍCHT", createdAt: formatDate(dateStr, 22, 30), updatedAt: formatDate(dateStr, 22, 30) });

      const paidOrders = orderDocs.filter((o: any) => o.status === "paid");
      const rev = paidOrders.reduce((s: number, o: any) => s + o.total, 0);
      const sub = paidOrders.reduce((s: number, o: any) => s + o.subtotal, 0);
      const tax = paidOrders.reduce((s: number, o: any) => s + o.totalTax, 0);
      const chg = paidOrders.reduce((s: number, o: any) => s + (o.totalCharge || 0), 0);
      await db.collection("dayclosings").insertOne({ date: dateStr, closedBy: "Admin GERÍCHT", summary: { totalOrders: paidOrders.length, totalRevenue: rev, totalSubtotal: sub, totalTax: tax, totalCharges: chg, avgTicket: paidOrders.length > 0 ? Math.round(rev / paidOrders.length * 100) / 100 : 0 }, warnings: { openComandas: 0, pendingBills: 0 }, createdAt: formatDate(dateStr, 23, 0), updatedAt: formatDate(dateStr, 23, 0) });
    }
  }

  await db.collection("configs").updateOne({}, { $set: { nextInvoiceNumber: invoiceNum } });

  // ── Gallery Media ──
  let galleryCat = await db.collection("mediacategories").findOne({ slug: "gallery" });
  if (!galleryCat) {
    const r = await db.collection("mediacategories").insertOne({ name: "Gallery", slug: "gallery", createdAt: new Date(), updatedAt: new Date() });
    galleryCat = { _id: r.insertedId };
  }

  const galleryImages = [
    { filename: "rammen-1.webp", url: "/gallery/rammen-1.webp", alt: "Plato de ramen en GERÍCHT", title: "Ramen", caption: "Nuestro ramen artesanal", description: "Ramen preparado con caldo casero y toppings frescos.", refType: "gallery", mimeType: "image/webp" },
    { filename: "whisky-2.webp", url: "/gallery/whisky-2.webp", alt: "Whisky en GERÍCHT", title: "Whisky", caption: "Selección premium de whiskies", description: "Nuestra exclusiva selección de whiskies de todo el mundo.", refType: "gallery", mimeType: "image/webp" },
    { filename: "egg-3.webp", url: "/gallery/egg-3.webp", alt: "Plato de huevo en GERÍCHT", title: "Huevo", caption: "Plato estrella del chef", description: "Huevo preparado con técnica sous-vide y guarnición de temporada.", refType: "gallery", mimeType: "image/webp" },
    { filename: "soup-4.webp", url: "/gallery/soup-4.webp", alt: "Sopa en GERÍCHT", title: "Sopa", caption: "Sopas artesanales", description: "Sopa preparada con ingredientes frescos del mercado local.", refType: "gallery", mimeType: "image/webp" },
    { filename: "waffle-5.webp", url: "/gallery/waffle-5.webp", alt: "Waffle en GERÍCHT", title: "Waffle", caption: "Postres irresistibles", description: "Waffle crujiente con frutas frescas y crema batida.", refType: "gallery", mimeType: "image/webp" },
  ];
  for (const img of galleryImages) {
    await db.collection("media").insertOne({ ...img, categories: [galleryCat._id], createdAt: new Date(), updatedAt: new Date() });
  }
  console.log("✅ " + galleryImages.length + " imágenes de galería");

  // ── Hero Slider Media ──
  let heroCat = await db.collection("mediacategories").findOne({ slug: "hero" });
  if (!heroCat) {
    const r = await db.collection("mediacategories").insertOne({ name: "Hero", slug: "hero", createdAt: new Date(), updatedAt: new Date() });
    heroCat = { _id: r.insertedId };
  }
  const heroSliderImages = [
    { filename: "image-1.jpg", url: "/hero/image-1.jpg", alt: "Plato principal GERÍCHT", title: "Especialidad de la casa", mimeType: "image/jpeg" },
    { filename: "image-2.jpg", url: "/hero/image-2.jpg", alt: "Cóctel GERÍCHT", title: "Coctelería de autor", mimeType: "image/jpeg" },
    { filename: "image-3.jpg", url: "/hero/image-3.jpg", alt: "Postre GERÍCHT", title: "Postres gourmet", mimeType: "image/jpeg" },
    { filename: "image-4.jpg", url: "/hero/image-4.jpg", alt: "Ambiente GERÍCHT", title: "Nuestro salón", mimeType: "image/jpeg" },
  ];
  for (const img of heroSliderImages) {
    await db.collection("media").insertOne({ ...img, categories: [heroCat._id], createdAt: new Date(), updatedAt: new Date() });
  }
  console.log("✅ " + heroSliderImages.length + " imágenes del hero");

  console.log(`✅ 14 días de operaciones (${invoiceNum - 1} facturas)`);
  console.log("");
  console.log("🎉 Seed completado!");
  console.log("   Admin: admin@gericht.com / admin123");
  console.log("   Staff: staff@gericht.com / staff123");

  await mongoose.disconnect();
}

main().catch((err) => { console.error("❌ Error:", err); process.exit(1); });
