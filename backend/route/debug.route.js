import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getReceiverSocketId, io } from "../libs/socket.js";

const router = express.Router();

// This route checks if a user's authentication is valid
router.get("/auth-status", protectRoute, (req, res) => {
  try {
    // If protectRoute middleware passes, user is authenticated
    res.status(200).json({
      isAuthenticated: true,
      userId: req.user._id,
      email: req.user.email,
      fullname: req.user.fullname,
    });
  } catch (error) {
    res.status(500).json({
      isAuthenticated: false,
      error: error.message,
    });
  }
});

// This route checks if a user's socket is connected
router.get("/socket-status", protectRoute, (req, res) => {
  try {
    const userId = req.user._id;
    const socketId = getReceiverSocketId(userId);

    res.status(200).json({
      userId,
      socketConnected: !!socketId,
      socketId: socketId || null,
      activeConnections: io.engine.clientsCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// This route sends a test message via socket to the user
router.post("/test-socket", protectRoute, (req, res) => {
  try {
    const userId = req.user._id;
    const socketId = getReceiverSocketId(userId);

    if (!socketId) {
      return res.status(400).json({
        success: false,
        message: "User socket not connected",
      });
    }

    // Send test message to the user's socket
    io.to(socketId).emit("test", {
      message: "Test message from server",
      timestamp: new Date(),
    });

    res.status(200).json({
      success: true,
      message: "Test message sent",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
