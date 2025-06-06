import { configDotenv } from "dotenv";
import jwt from "jsonwebtoken";

configDotenv();
export const generateToken = (userID, res) => {
  const token = jwt.sign({ userID }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  res.cookie("jwt", token, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax", // Using lax to allow cross-site cookies in development
    secure: process.env.NODE_ENV !== "development",
    path: "/", // Ensure cookie is available across all routes
  });
  return token;
};
