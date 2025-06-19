import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv();

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Add connection options
      retryWrites: true,
      w: "majority",
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`Connected to DB: ${conn.connection.host}`);
  } catch (err) {
    console.log("Database connection error:", err);
    process.exit(1); // Exit process with failure
  }
};
