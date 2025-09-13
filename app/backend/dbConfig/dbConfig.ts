import mongoose from "mongoose";
import { MONGODB_URI } from "../config/constant";

// Use global variable to persist connection across serverless function invocations
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connect() {
  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI as string, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;

    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("MongoDB connected");
    });

    connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
      // No process.exit — just logging
    });

    return cached.conn;
  } catch (error) {
    // Reset cached.promise so that next call can retry
    cached.promise = null;
    console.error("MongoDB connection failed:", error);
    throw error;
  }
}
