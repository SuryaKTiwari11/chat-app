import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

    export const useChatStore = create((set, get) => ({
  message: [],
  users: [],
  isUsersLoading: true,
  isMessagesLoading: true,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const response = await axiosInstance.get("/message/users");
      set({ users: response.data });
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users. Please try again.");
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const response = await axiosInstance.get(`/message/${userId}`);
      set({ message: response.data });
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages. Please try again.");
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, message } = get();
    if (!selectedUser) {
      toast.error("Please select a user to send a message.");
      return;
    }
    try {
      const response = await axiosInstance.post(
        `/message/send/${selectedUser.id}`,
        {
          content: messageData,
        }
      );
      set({ message: [...message, response.data] });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    }
  },
  subscribeToMessages: () => {
    const {selectedUser} = get();
    if (!selectedUser) {
      console.error("No user selected for message subscription");
      return;
    }
    const socket = useAuthStore.getState().socket;
    if (!socket) {
      console.error("Socket not initialized");
      return;
    }
    //todo:optimization
   socket.on('newMessage', (newMessage) => {
     set((state) => ({
       message: [...state.message, newMessage],
     }));
  },
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
  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
  },
}));
