// scripts/initDb.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import { createSpaceTypeSchemeIfNotExist } from "../../app/backend/models/space_type_scheme";
import mongoConnection from "@/app/backend/lib/db/db-config";

export async function seed() {
  try {
    await mongoConnection.connect();
    await createSpaceTypeSchemeIfNotExist();
  } catch (e) {
    console.error("already have valued");
  }
  mongoose.connection.close();
}

if (require.main === module) {
  seed().catch((err) => {
    console.error("❌ Unhandled error:", err);
    process.exit(1);
  });
}
