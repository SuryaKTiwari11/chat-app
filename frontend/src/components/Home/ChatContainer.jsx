// filepath: c:\Users\SURYA\Desktop\chat app\frontend\src\components\Home\ChatContainer.jsx
import { useEffect, useRef } from "react";
import MessageInput from "./MessageInput";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";
import { formatMessageTime } from "../../lib/utils";
import ChatHeader from "./ChatHeader";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [
    selectedUser._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);
  // Combined effect to handle scrolling on new messages or chat selection
  useEffect(() => {
    // Scroll to the bottom when messages change or when selecting a new chat
    if (messagesContainerRef.current && messages) {
      // Using setTimeout to ensure DOM is fully updated
      setTimeout(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop =
            messagesContainerRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [messages, selectedUser?._id]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {" "}
        {messages.map((message, index) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            } ${index === messages.length - 1 ? "animate-slide-in-right" : ""}`}
            ref={index === messages.length - 1 ? messageEndRef : null}
          >
            {" "}
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border-2 border-indigo-500 shadow-md hover:shadow-indigo-500/30 transition-all duration-300 group overflow-hidden relative">
                {/* Animated ring on hover */}
                <div className="absolute inset-0 border-4 border-transparent rounded-full group-hover:border-cyan-400/30 group-hover:animate-spin-slow"></div>

                {message.senderId === authUser._id && authUser.profilePic ? (
                  <img
                    src={authUser.profilePic}
                    alt="profile pic"
                    className="hover:scale-105 transition-transform duration-500 group-hover:animate-pulse-once"
                    onError={(e) => {
                      e.target.onerror = null;
                      const canvas = document.createElement("canvas");
                      canvas.width = 100;
                      canvas.height = 100;
                      const ctx = canvas.getContext("2d");
                      // Updated gradient background
                      const gradient = ctx.createLinearGradient(0, 0, 100, 100);
                      gradient.addColorStop(0, "#6366f1"); // indigo-500
                      gradient.addColorStop(1, "#22d3ee"); // cyan-400
                      ctx.fillStyle = gradient;
                      ctx.fillRect(0, 0, canvas.width, canvas.height);

                      ctx.font = "bold 50px Arial";
                      ctx.fillStyle = "white";
                      ctx.textAlign = "center";
                      ctx.textBaseline = "middle";
                      ctx.fillText(
                        authUser.fullname[0]?.toUpperCase() || "U",
                        canvas.width / 2,
                        canvas.height / 2
                      );
                      e.target.src = canvas.toDataURL();
                    }}
                  />
                ) : message.senderId !== authUser._id &&
                  selectedUser.profilePic ? (
                  <img
                    src={selectedUser.profilePic}
                    alt="profile pic"
                    onError={(e) => {
                      e.target.onerror = null;
                      const canvas = document.createElement("canvas");
                      canvas.width = 100;
                      canvas.height = 100;
                      const ctx = canvas.getContext("2d");
                      // Updated gradient background
                      const gradient = ctx.createLinearGradient(0, 0, 100, 100);
                      gradient.addColorStop(0, "#6366f1"); // indigo-500
                      gradient.addColorStop(1, "#22d3ee"); // cyan-400
                      ctx.fillStyle = gradient;
                      ctx.fillRect(0, 0, canvas.width, canvas.height);

                      ctx.font = "bold 50px Arial";
                      ctx.fillStyle = "white";
                      ctx.textAlign = "center";
                      ctx.textBaseline = "middle";
                      ctx.fillText(
                        selectedUser.fullname[0]?.toUpperCase() || "U",
                        canvas.width / 2,
                        canvas.height / 2
                      );
                      e.target.src = canvas.toDataURL();
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-semibold text-xl animate-gradient bg-300% group-hover:animate-pulse">
                    <span className="group-hover:animate-subtle-bounce transition-all duration-300">
                      {message.senderId === authUser._id
                        ? authUser.fullname[0]?.toUpperCase() || "U"
                        : selectedUser.fullname[0]?.toUpperCase() || "U"}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>{" "}
            <div
              className={`chat-bubble flex flex-col ${
                message.senderId === authUser._id
                  ? "bg-gradient-to-r from-indigo-500/90 to-cyan-500/90 hover:from-indigo-500 hover:to-cyan-500"
                  : "bg-[#334155] hover:bg-[#3d4d69]"
              } shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]`}
            >
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2 hover:opacity-95 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105"
                />
              )}
              {message.text && (
                <p className="hover:animate-subtle-bounce">{message.text}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;
