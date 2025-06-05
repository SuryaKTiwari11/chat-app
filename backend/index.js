import express from "express";
import authRouter from "./route/auth.route.js";
import messageRouter from "./route/message.route.js";
import { configDotenv } from "dotenv";
import { connectDB } from "./libs/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { app, server } from "./libs/socket.js";

configDotenv();

const PORT = process.env.PORT;
app.use(express.json()); // to de construct the req
app.use(cookieParser()); // for handling JWT cookies
app.use(
  cors({
    origin: ["http://localhost:5173", process.env.PRODUCTION_URL],
    credentials: true,
  })
);
app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter); // for handling JWT cookies
server.listen(PORT, () => {
  console.log(`server is running on PORT:${PORT}`);
  connectDB();
});
