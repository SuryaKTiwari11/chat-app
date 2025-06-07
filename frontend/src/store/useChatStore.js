import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { successToast, errorToast, loadingToast, updateToast, infoToast } from "../utils/toastStyles";
import { useAuthStore } from "./useAuthStore";
export const useChatStore = create((set, get) => ({
  messages: [], // Renamed from message to messages for consistency
  users: [],
  selectedUser: null,
  isUsersLoading: true,
  isMessagesLoading: true,
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const response = await axiosInstance.get("/messages/user");      console.log("Users fetched:", response.data);
      set({ users: response.data });
    } catch (error) {
      console.error("Error fetching users:", error);
      errorToast("Failed to load users. Please try again.");
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const response = await axiosInstance.get(`/messages/${userId}`);      set({ messages: response.data });
    } catch (error) {
      console.error("Error fetching messages:", error);
      errorToast("Failed to load messages. Please try again.");
    } finally {
      set({ isMessagesLoading: false });
    }
  },  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    if (!selectedUser) {
      errorToast("Please select a user to send a message.");
      return;
    }

    try {
      // Check if image exists and verify its size
      if (messageData.image) {
        // Calculate base64 size (approximate)
        const base64Length =
          messageData.image.length - (messageData.image.indexOf(",") + 1);
        const sizeInBytes = base64Length * 0.75; // base64 is ~33% larger than binary
        const sizeInMB = sizeInBytes / (1024 * 1024);

        if (sizeInMB > 8) {
          throw new Error(
            "Image too large (max 8MB). Please resize or select a smaller image."
          );
        }
      }

      // Send the message with increased timeout for image uploads
      const response = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData,
        {
          timeout: messageData.image ? 30000 : 5000, // 30s timeout for images, 5s for text
          maxBodyLength: 10 * 1024 * 1024, // 10MB max size
          maxContentLength: 10 * 1024 * 1024, // 10MB max size
        }
      );

      set({ messages: [...messages, response.data] });
      return response.data;
    } catch (error) {
      console.error("Error sending message:", error);      // Handle different error types with more specific messages
      if (!navigator.onLine) {
        errorToast("No internet connection. Please check your network.");
      } else if (error?.response?.status === 413) {
        errorToast(
          "Image too large. Maximum size is 5MB. Please resize or select a smaller image."
        );
      } else if (error?.response?.status === 401) {
        errorToast("Authentication error. Please try logging in again.");
      } else if (error?.response?.status >= 500) {
        errorToast("Server error. Please try again later.");
      } else if (error?.message?.includes("timeout")) {
        errorToast(
          "Request timed out. Your image may be too large or the server is busy."
        );
      } else if (error?.message) {
        errorToast(error.message);
      } else {
        errorToast("Failed to send message. Please try again.");
      }

      throw error; // Rethrow for component-level handling
    }
  },
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) {
      console.error("No user selected for message subscription");
      return;
    }
    const socket = useAuthStore.getState().socket;
    if (!socket) {
      console.error("Socket not initialized");
      return;
    }

    // First remove any existing listeners to prevent duplicates
    socket.off("newMessage");
    socket.off("profileUpdated");
    
    // Listen for profile updates from other users
    socket.on("profileUpdated", (data) => {
      console.log("Received profile update via socket:", data);
      if (data && data.userId && data.newProfileData) {
        // Update the user in our local store
        get().updateUserProfile(data.userId, data.newProfileData);
        
        // If this is the currently selected user, refresh UI elements
        if (get().selectedUser && get().selectedUser._id === data.userId) {
          // Force refresh profile images that might be cached
          setTimeout(() => {
            const profilePic = data.newProfileData.profilePic;
            if (profilePic) {
              const timestamp = new Date().getTime();
              document.querySelectorAll(`img[alt="${data.newProfileData.fullname}"]`).forEach(img => {
                if (img.src.includes(profilePic.split('?')[0])) {
                  img.src = profilePic.includes('?') 
                    ? `${profilePic}&t=${timestamp}` 
                    : `${profilePic}?t=${timestamp}`;
                }
              });
            }
          }, 100);
        }
      }
    });
    
    // Add the message listener
    socket.on("newMessage", (newMessage) => {
      console.log("Received new message:", newMessage);
      const authUser = useAuthStore.getState().authUser;

      // Check if the message is relevant to the current user
      const isForCurrentUser =
        newMessage.senderId === authUser._id ||
        newMessage.receiverId === authUser._id;

      if (!isForCurrentUser) return;

      // Check if message is part of the currently selected conversation
      const isFromSelectedConversation =
        newMessage.senderId === selectedUser._id ||
        newMessage.receiverId === selectedUser._id;

      if (isFromSelectedConversation) {
        // Add it to the current conversation
        set((state) => ({
          messages: [...state.messages, newMessage],
        }));
        console.log("Message added to current chat");
      } else if (newMessage.senderId !== authUser._id) {        // Message is from someone else, but not in current chat - show notification
        const userName =
          get().users.find((user) => user._id === newMessage.senderId)
            ?.fullname || "Someone";
          // Use a simpler toast notification without JSX
        const toastId = successToast(`New message from ${userName}`);
        
        // Add click listener to the toast to navigate to the conversation
        document.getElementById(toastId)?.addEventListener("click", () => {
          // Find the user and switch to their chat when the notification is clicked
          const user = get().users.find(
            (user) => user._id === newMessage.senderId
          );
          if (user) {
            set({ selectedUser: user });
            toast.dismiss(toastId);
          }
        });
      }
    });

    console.log(
      "Subscribed to new messages for user:",
      selectedUser.fullname || selectedUser._id
    );
  },
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) {
      console.error("Socket not initialized");
      return;
    }
    socket.off("newMessage");
  },
  setSelectedUser: (user) => {
    set({ selectedUser: user });
  },
  updateUserProfile: (userId, updatedData) => {
    set((state) => {
      // Update in users list
      const updatedUsers = state.users.map(user => 
        user._id === userId ? { ...user, ...updatedData } : user
      );
      
      // Update selected user if it's the one being changed
      let updatedSelectedUser = state.selectedUser;
      if (state.selectedUser && state.selectedUser._id === userId) {
        updatedSelectedUser = { ...state.selectedUser, ...updatedData };
      }
      
      return { 
        users: updatedUsers,
        selectedUser: updatedSelectedUser
      };
    });
  },
}));
