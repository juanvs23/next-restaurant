import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/gericht_e2e";

export default async function run() {
  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db!;

  const collections = await db.listCollections().toArray();
  for (const col of collections) {
    await db.collection(col.name).deleteMany({});
  }

  const hashedPassword = await bcrypt.hash("admin123", 10);
  await db.collection("users").insertOne({
    name: "Admin Test",
    email: "admin@test.com",
    password: hashedPassword,
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await db.collection("configs").insertOne({
    businessName: "E2E Test Restaurant",
    rif: "J-12345678-9",
    taxRate: 0.16,
    serviceChargeRate: 0.10,
    serviceChargeTaxable: false,
    defaultDeliveryCost: 5,
    paymentMethods: ["cash", "card", "transfer"],
    nonWorkingDays: [0],
    holidays: [],
    defaultLanguage: "es",
    timezone: "-04:00",
    exchangeRateBcv: 36.5,
    nextInvoiceNumber: 1,
    nextCreditNoteNumber: 1,
    storageProvider: "local",
    s3Config: {
      accessKeyId: "",
      secretAccessKey: "",
      region: "",
      bucket: "",
      endpoint: "",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await db.collection("categories").insertOne({
    name: "Test Category",
    image: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await db.collection("turns").insertOne({
    label: "Lunch",
    time: "12:00-15:00",
    color: "#f59e0b",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await mongoose.disconnect();
  console.log("✅ E2E database seeded");
}
