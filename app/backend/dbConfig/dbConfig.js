import mongoose from "mongoose";
import { MONGODB_URI } from "../config/constant";
export async function connect() {
  try {
    await mongoose.connect(MONGODB_URI);
    const connection = mongoose.connection;
    connection.on("connected", () => {});
    connection.on("error", (e) => {
      console.log(e);
      process.exit(500);
    });
  } catch (e) {
    console.log("something went wrong in connecting to wrong");
    console.log(e);
  }
}
