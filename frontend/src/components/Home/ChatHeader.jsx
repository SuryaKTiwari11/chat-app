import { X } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar with enhanced animations */}
          <div className="avatar">
            <div
              className={`size-10 rounded-full relative transition-all duration-300 border-2 ${
                isOnline ? "border-cyan-500/70" : "border-indigo-500/30"
              } group`}
            >
              <div
                className={`absolute inset-0 rounded-full ${
                  isOnline ? "animate-pulse" : ""
                } ${
                  isOnline
                    ? "bg-gradient-to-r from-cyan-400/20 to-cyan-500/5"
                    : ""
                }`}
              ></div>
              <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500/30 to-cyan-400/30 rounded-full blur-lg opacity-0 group-hover:opacity-70 transition-all duration-500"></div>
              {selectedUser.profilePic ? (
                <img
                  src={selectedUser.profilePic}
                  alt={selectedUser.fullname}
                  className="object-cover transform group-hover:scale-105 transition-transform duration-500 z-10"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/avatar.jpg";
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-cyan-400 flex items-center justify-center text-white animate-gradient z-10">
                  {selectedUser.fullname?.[0]?.toUpperCase() || "U"}
                </div>
              )}
            </div>
          </div>

          {/* User info with enhanced animations */}
          <div className="animate-fade-in">
            <h3 className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-100">
              {selectedUser.fullname}
            </h3>
            <p
              className={`text-sm transition-colors duration-300 ${
                isOnline ? "text-cyan-400" : "text-gray-400"
              } flex items-center gap-1.5`}
            >
              <span
                className={`inline-block size-1.5 rounded-full ${
                  isOnline ? "bg-cyan-400 animate-pulse" : "bg-gray-500"
                }`}
              ></span>
              {isOnline ? "Active now" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button with animation */}
        <button
          onClick={() => setSelectedUser(null)}
          className="p-2 rounded-full hover:bg-[#1E293B] transition-colors duration-300 hover:text-indigo-400 active:scale-95 transform"
        >
          <X className="size-5" />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;
