import express from "express";
import authRouter from "./route/auth.route.js";
import { configDotenv } from "dotenv";
import { connectDB } from "./libs/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";

configDotenv();
const app = express();

const PORT = process.env.PORT;

app.use(cors());
app.use(express.json()); // to de construct the req
app.use(cookieParser()); // for handling JWT cookies
app.use("/api/auth", authRouter);
app.listen(PORT, () => {
  console.log(`server is running on PORT:${PORT}`);
  connectDB();
});
