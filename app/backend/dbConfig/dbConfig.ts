import mongoose from "mongoose";
import { MONGODB_URI } from "../config/constant";

// MongoDB connection states (numeric values)
const CONNECTED = 1;
const DISCONNECTED = 0;
const CONNECTING = 2;

export async function connect() {
  // Check if the connection is already established
  if (mongoose.connection.readyState === CONNECTED) {
    return mongoose.connection;
  }

  // If the connection is still connecting or disconnected, try reconnecting
  if (
    mongoose.connection.readyState === CONNECTING ||
    mongoose.connection.readyState === DISCONNECTED
  ) {
    await new Promise((resolve, reject) => {
      mongoose.connection.once("connected", resolve);
      mongoose.connection.once("error", reject);
    });
    return mongoose.connection;
  }

  // Create a new connection if needed
  try {
    await mongoose.connect(MONGODB_URI as string, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // Timeout for DB connection
    });

    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected");
    });

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    return mongoose.connection;
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
}
