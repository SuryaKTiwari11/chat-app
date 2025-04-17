import express from "express";
const router = express.Router();
import { protectRoute } from "../middleware/auth.middleware.js";
import { getUserForSidebar,getMessages } from "../controllers/message.controller.js";

router.get("/user",protectRoute,getUserForSidebar);
router.get("/:id",protectRoute,getMessages); // for getting the user for sidebar
export default router;