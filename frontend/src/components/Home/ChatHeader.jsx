import { X } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {" "}
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              {selectedUser.profilePic ? (
                <img
                  src={selectedUser.profilePic}
                  alt={selectedUser.fullname}
                  className="object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/avatar.jpg";
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-cyan-400 flex items-center justify-center text-white">
                  {selectedUser.fullname?.[0]?.toUpperCase() || "U"}
                </div>
              )}

             
            </div>
          </div>
          {/* User info */}{" "}
          <div>
            <h3 className="font-medium">{selectedUser.fullname}</h3>
            <p className="text-sm text-gray-400">
              {onlineUsers.includes(selectedUser._id) ? "Active now" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;
