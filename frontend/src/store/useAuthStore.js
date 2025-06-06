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
        set({ isCheckingAuth: false });
        return;
      }

      const response = await axiosInstance.get("/auth/check");

      if (response.data) {
        console.log("Auth check successful, user data:", response.data);
        set({ authUser: response.data });

        try {
          get().connectSocket();
        } catch (socketError) {
          console.error(
            "Socket connection failed during auth check:",
            socketError
          );
        }
      }
    } catch (error) {
      console.error(
        "Error checking authentication:",
        error?.response?.status || error.message
      );

      // Only clear user data if it's an authentication error
      if (error?.response?.status === 401) {
        set({ authUser: null });
        console.log("User not authenticated");
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
      set({ authUser: response.data });
      toast.success("Signup successful!");

      // Try to connect socket
      try {
        get().connectSocket();
      } catch (socketError) {
        console.error("Socket connection failed:", socketError);
        // Continue with signup even if socket fails
      }

      // Redirect to chat page after signup
      window.location.href = "/chat";
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
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logout successful!");
      get().disconnectSocket(); // Disconnect socket on logout

      // Redirect to login page after logout
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    } finally {
      set({ isLoggingOut: false });
    }
  },
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const response = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: response.data });
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("Profile update failed. Please try again.");
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
    if (get().socket?.connected) {
      console.warn("Socket is already connected");
      return;
    } // Make sure we have a valid URL for the socket connection
    console.log("Connecting to socket at", BASE_URL);

    // Ensure we have a valid socket URL
    if (!BASE_URL) {
      console.error("No BASE_URL available for socket connection");
      return;
    }

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
      withCredentials: true,
    });
    socket.connect();
    set({ socket });
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
      console.log("Online users updated:", userIds);
    });
  },
  disconnectSocket: () => {
    const { socket } = get();
    if (get().socket?.connected) {
      socket.disconnect();
      set({ socket: null });
      console.log("Socket disconnected");
    }
  },
}));
