import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getUserForSidebar,
  getMessages,
  sendMessage,
} from "../controllers/message.controller.js";
const router = express.Router();

router.get("/user", protectRoute, getUserForSidebar); // for getting users for sidebar
router.get("/:id", protectRoute, getMessages); // for getting messages with a specific user
router.post("/send/:id", protectRoute, sendMessage); // for sending a message to a user
export default router;
