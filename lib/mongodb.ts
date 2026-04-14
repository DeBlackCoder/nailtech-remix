import mongoose from "mongoose";
declare global { var mongoose: { conn: typeof import("mongoose") | null; promise: Promise<typeof import("mongoose")> | null } | undefined; }
let cached = global.mongoose ?? { conn: null, promise: null };
if (!global.mongoose) { global.mongoose = cached; }
export async function connectDB(): Promise<typeof mongoose> {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI environment variable is not set.");
  if (cached.conn) return cached.conn;
  if (!cached.promise) { cached.promise = mongoose.connect(process.env.MONGODB_URI); }
  cached.conn = await cached.promise;
  return cached.conn;
}
