import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

// Vite automatically loads environment variables from .env files
// No need to import dotenv in the frontend
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
  checkAuth: async () => {
    try {
      // Check if we already have a user, to avoid redundant API calls
      const currentUser = get().authUser;
      if (currentUser) {
        console.log("User already authenticated:", currentUser);

        // Verify the socket connection is active or reconnect
        const socket = get().socket;
        if (!socket || !socket.connected) {
          console.log("Reconnecting socket for existing user session");
          try {
            get().connectSocket();
          } catch (socketError) {
            console.error("Socket reconnection failed:", socketError);
          }
        }

        set({ isCheckingAuth: false });
        return;
      }

      console.log("Checking authentication with backend...");
      const response = await axiosInstance.get("/auth/check");

      if (response.data) {
        console.log("Auth check successful, user data:", response.data);
        set({ authUser: response.data });

        // Initialize socket connection
        try {
          get().connectSocket();
        } catch (socketError) {
          console.error(
            "Socket connection failed during auth check:",
            socketError
          );
          // Continue even if socket fails - we still have authenticated user
        }
      } else {
        // If we get a response but no data, consider the user not authenticated
        console.log("Auth check returned empty response");
        set({ authUser: null });
      }
    } catch (error) {
      console.error(
        "Error checking authentication:",
        error?.response?.status || error.message
      );

      // Clear user data on auth errors or network errors
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        set({ authUser: null });
        console.log("User not authenticated");
      } else if (error.code === "ERR_NETWORK") {
        console.log("Network error during auth check - server might be down");
        // Don't clear authUser on network error to allow offline functionality
      }
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const response = await axiosInstance.post("/auth/signup", data);

      if (!response.data) {
        throw new Error("No data received from server");
      }

      console.log("Signup successful, user data:", response.data);
      // Don't set authUser on signup - wait for login
      toast.success("Signup successful! Please login with your credentials");

      // Redirect to login page after signup instead of chat
      window.location.href = "/login";
    } catch (error) {
      console.error(
        "Signup failed:",
        error?.response?.data?.message || error.message
      );
      toast.error(
        error?.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      set({ isSigningUp: false });
    }
  },
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const response = await axiosInstance.post("/auth/login", data);

      if (!response.data) {
        throw new Error("No data received from server");
      }

      console.log("Login successful, user data:", response.data);
      set({ authUser: response.data });
      toast.success("Login successful!");

      // Try to connect socket
      try {
        get().connectSocket();
      } catch (socketError) {
        console.error("Socket connection failed:", socketError);
        // Continue with login even if socket fails
      }

      // Redirect to chat page
      window.location.href = "/chat";
    } catch (error) {
      console.error(
        "Login failed:",
        error?.response?.data?.message || error.message
      );
      toast.error(
        error?.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      set({ isLoggingIn: false });
    }
  },
  logout: async () => {
    set({ isLoggingOut: true });
    try {
      // First disconnect socket to prevent connection issues
      get().disconnectSocket();

      // Then logout from the server
      await axiosInstance.post("/auth/logout");

      // Clear the auth user data
      set({
        authUser: null,
        onlineUsers: [],
      });

      toast.success("You've been logged out successfully!");

      // Small delay before redirect to ensure state is updated
      setTimeout(() => {
        window.location.href = "/login";
      }, 300);
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Couldn't log you out. Please try again.");

      // Even if server logout fails, we should still clear local state
      set({ authUser: null, onlineUsers: [] });

      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    } finally {
      set({ isLoggingOut: false });
    }
  },
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      if (!navigator.onLine) {
        throw new Error(
          "You appear to be offline. Please check your connection."
        );
      }

      // Create a cleaner payload - only send fields that were updated
      const payload = {};
      if (data.fullname) payload.fullname = data.fullname;
      if (data.bio !== undefined) payload.bio = data.bio;
      if (data.profilePic) payload.profilePic = data.profilePic;

      // Don't make API call if there's nothing to update
      if (Object.keys(payload).length === 0) {
        console.warn("No data to update");
        return;
      }

      const response = await axiosInstance.put("/auth/update-profile", payload);

      // Get the previous authUser for notification
      const prevUser = get().authUser;

      // Update the local user object with new data
      set({ authUser: response.data });
      // Notify other components that profile has been updated
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("profileUpdated", {
            detail: {
              previousData: prevUser,
              updatedData: response.data,
            },
          })
        );
      }

      // If we have an active socket, notify other users about profile change
      const socket = get().socket;
      if (socket && socket.connected) {
        try {
          socket.emit("profileUpdated", {
            userId: response.data._id,
            newProfileData: {
              fullname: response.data.fullname,
              profilePic: response.data.profilePic,
            },
          });
          console.log("Notified other users about profile update via socket");
        } catch (socketError) {
          console.error(
            "Failed to notify about profile update via socket:",
            socketError
          );
        }
      }

      return response.data; // Return the updated data to the caller
    } catch (error) {
      console.error("Profile update failed:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Profile update failed. Please try again.";
      toast.error(errorMessage);
      throw error; // Re-throw the error so caller can handle it
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser) {
      console.warn("Cannot connect socket, user is not authenticated");
      return;
    }

    // Check if socket already exists and is connected
    const existingSocket = get().socket;
    if (existingSocket?.connected) {
      console.warn("Socket is already connected");
      return;
    }

    // Disconnect existing socket if it exists but isn't connected
    if (existingSocket) {
      try {
        existingSocket.disconnect();
        console.log("Disconnected existing socket");
      } catch (err) {
        console.warn("Error disconnecting existing socket:", err.message);
      }
    }

    console.log("Connecting to socket at", BASE_URL);

    // Ensure we have a valid socket URL
    if (!BASE_URL) {
      console.error("No BASE_URL available for socket connection");
      return;
    }

    try {
      const socket = io(BASE_URL, {
        query: {
          userId: authUser._id,
        },
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        timeout: 10000, // 10 seconds connection timeout
        autoConnect: true,
        transports: ["websocket", "polling"], // Try WebSocket first, fallback to polling
      });

      // Connection event handlers
      socket.on("connect", () => {
        console.log("Socket connected successfully with ID:", socket.id);

        // Update UI to show connected status if needed
        if (!get().socket?.connected) {
          set({ socket }); // Update the socket in the store
        }
      });

      socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error.message);
        // Could add toast notification here if connection fails repeatedly
      });

      socket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);

        // Auto reconnect if disconnected due to server issues
        if (reason === "io server disconnect" || reason === "transport close") {
          socket.connect();
        }
      });

      socket.on("reconnect", (attemptNumber) => {
        console.log(`Socket reconnected after ${attemptNumber} attempts`);
      });

      socket.on("reconnect_error", (error) => {
        console.error("Socket reconnection error:", error.message);
      });

      socket.on("reconnect_failed", () => {
        console.error("Socket reconnection failed");
        toast.error("Connection to chat server lost. Please refresh the page.");
      });

      socket.on("error", (error) => {
        console.error("Socket error:", error);
      });
      // Business logic events
      socket.on("getOnlineUsers", (userIds) => {
        set({ onlineUsers: userIds });
        console.log("Online users updated:", userIds.length, "users");
      });

      // Test message event for debugging
      socket.on("test", (data) => {
        console.log("Test message received:", data);
        toast.success("Test message received: " + data.message);
      });

      set({ socket });
    } catch (error) {
      console.error("Error setting up socket connection:", error);
    }
  },
  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      try {
        socket.disconnect();
        console.log("Socket disconnected successfully");
      } catch (error) {
        console.error("Error disconnecting socket:", error);
      } finally {
        set({ socket: null, onlineUsers: [] });
      }
    }
  },
}));
