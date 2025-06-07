import { MessageSquare, Users } from "lucide-react";

const NoChatSelected = () => {
  // Removed onlineUsers and onlineCount as they're no longer needed

  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
      <div className="max-w-md text-center space-y-6">
        {/* Icon Display */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-pulse">
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>{" "}
            {/* Online indicator removed as requested */}
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          Welcome to ConnectChat
        </h2>
        <p className="text-base-content/60">
          Select a conversation from the sidebar to start chatting with your
          contacts
        </p>

        <div className="pt-4 text-sm text-base-content/50">
          <div className="flex items-center justify-center gap-1">
            <Users className="w-4 h-4" />
            <span>Click on any contact to begin</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoChatSelected;
