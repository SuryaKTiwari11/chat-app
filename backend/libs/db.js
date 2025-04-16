import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv();
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`connect to DB:${conn.connection.host}`);
  } catch (err) {
    console.log(err);
  }
};
