import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/gericht_e2e";

export default async function run() {
  await mongoose.connect(MONGO_URI);
  await mongoose.connection.db?.dropDatabase();
  await mongoose.disconnect();
  console.log("🧹 E2E database dropped");
}
