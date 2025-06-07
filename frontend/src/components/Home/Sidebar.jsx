import { useEffect, useState } from "react";
import SidebarSkeleton from "../skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();

  const { onlineUsers = [], authUser } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]); // Ensure users is always an array before filtering
  const usersArray = Array.isArray(users) ? users : [];

  // First sort users: online users first, then by most recent (assumes newer users are at the end of the array)
  const sortedUsers = [...usersArray].sort((a, b) => {
    const isAOnline = Array.isArray(onlineUsers) && onlineUsers.includes(a._id);
    const isBOnline = Array.isArray(onlineUsers) && onlineUsers.includes(b._id);

    // First, sort by online status
    if (isAOnline && !isBOnline) return -1; // A is online, B is offline
    if (!isAOnline && isBOnline) return 1; // A is offline, B is online

    // If online status is the same, newer users (assuming higher _id) come first
    // This assumes MongoDB ObjectIDs where newer objects have higher timestamps encoded in the ID
    if (a._id > b._id) return -1; // A is newer
    if (a._id < b._id) return 1; // B is newer

    return 0;
  });

  const filteredUsers = showOnlineOnly
    ? sortedUsers.filter(
        (user) => Array.isArray(onlineUsers) && onlineUsers.includes(user._id)
      )
    : sortedUsers;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>{" "}
        {/* Online filter toggle */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />{" "}
            <span className="text-sm">
              Show online only
              {Array.isArray(onlineUsers) && onlineUsers.length > 0 && (
                <span className="ml-1 text-green-500">
                  ({onlineUsers.filter((id) => id !== authUser?._id).length}{" "}
                  online)
                </span>
              )}
            </span>
          </label>
        </div>
      </div>

      {/* Users list */}
      <div className="flex-1 overflow-y-auto py-2">
        {filteredUsers.length === 0 ? (
          <div className="h-full flex items-center justify-center flex-col gap-2 text-center p-4">
            <Users className="size-8 text-gray-400" />
            <p className="text-sm text-gray-400">
              {showOnlineOnly
                ? "No users are currently online"
                : "No users found"}
            </p>
          </div>
        ) : (
          <ul>
            {filteredUsers.map((user) => {
              // Skip the current user
              if (user._id === authUser?._id) return null;

              const isOnline =
                Array.isArray(onlineUsers) && onlineUsers.includes(user._id);
              const isSelected = selectedUser?._id === user._id;

              return (
                <li key={user._id}>
                  <button
                    onClick={() => setSelectedUser(user)}
                    className={`w-full p-2 lg:p-3 flex items-center gap-2 hover:bg-base-200 transition-colors ${
                      isSelected ? "bg-base-200" : ""
                    }`}
                  >
                    <div className="relative">
                      {" "}
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-base-300">
                        {user.profilePic ? (
                          <img
                            src={user.profilePic}
                            alt={user.fullname}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              // Create initial avatar when image fails to load
                              const canvas = document.createElement("canvas");
                              canvas.width = 100;
                              canvas.height = 100;
                              const ctx = canvas.getContext("2d");
                              ctx.fillStyle = "#3b82f6";
                              ctx.fillRect(0, 0, canvas.width, canvas.height);
                              ctx.fillStyle = "white";
                              ctx.font = "50px Arial";
                              ctx.textAlign = "center";
                              ctx.textBaseline = "middle";
                              ctx.fillText(
                                user.fullname[0]?.toUpperCase() || "U",
                                canvas.width / 2,
                                canvas.height / 2
                              );
                              e.target.src = canvas.toDataURL();
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                            {user.fullname[0]?.toUpperCase() || "U"}
                          </div>
                        )}
                      </div>{" "}
                      {/* Online status indicator - with bouncing animation */}
                      {isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-base-100 bg-green-500 animate-bounce"></div>
                      )}
                    </div>{" "}
                    <div className="hidden lg:block text-left">
                      <h3 className="font-medium text-sm">{user.fullname}</h3>
                      <p className="text-xs text-gray-400">
                        {isOnline ? "" : "Offline"}
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
