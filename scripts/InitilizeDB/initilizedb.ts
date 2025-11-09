// scripts/initDb.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import { connect } from "../../app/backend/dbConfig/dbConfig"; //./app/backend/dbConfig/dbConfig
import { createSpaceTypeSchemeIfNotExist } from "../../app/backend/models/space_type_scheme"; //./app/backend/dbConfig/dbConfig

export async function seed() {
  try {
    await connect();
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
