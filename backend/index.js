import express from "express";
import authRouter from "./route/auth.route.js";

const app = express();
const PORT = 5001;

app.use("/use/auth",authRouter);
app.listen(PORT, () => {
  console.log   (`server is running on PORT:${PORT}`);
});
