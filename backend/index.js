import express from "express";
import authRouter from "./route/auth.route.js";
import messageRouter from "./route/message.route.js";
import debugRouter from "./route/debug.route.js";
import { configDotenv } from "dotenv";
import { connectDB } from "./libs/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { app, server } from "./libs/socket.js";
import path from "path";
configDotenv();

const PORT = process.env.PORT;
// Increase JSON payload size limit to handle larger image uploads (10MB)
app.use(express.json({ limit: "10mb" }));
// Increase URL-encoded payload size limit as well
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser()); // for handling JWT cookies
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      process.env.PRODUCTION_URL,
      process.env.LOCAL_URL,
      "https://*.onrender.com",  // Allow all Render.com subdomains
      "https://*.vercel.app"     // Allow all Vercel.app subdomains
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

// Additional headers for CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});
app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter); // for handling messages
app.use("/api/debug", debugRouter); // for debugging and status checks

const __dirname = path.resolve();

// Serve static files and handle client-side routing in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  
  // Handle client-side routing
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
  });
  // Handle React routing, return all requests to React app
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}
server.listen(PORT, () => {
  console.log(`server is running on PORT:${PORT}`);
  connectDB();
});
