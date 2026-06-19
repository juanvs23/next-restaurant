import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_URI || "";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGO_URI environment variable");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: process.env.DB_NAME,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export const closeDB = async () => {
  // No-op: connection pooling manages this automatically.
  // Calling closeDB() per request defeats connection reuse.
};
