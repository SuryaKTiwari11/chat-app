import React from "react";
import { MessageSquare, Users } from "lucide-react";

const NoChatSelected = () => {
  // Removed onlineUsers and onlineCount as they're no longer needed

  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
      <div className="max-w-md text-center space-y-6 animate-fade-in">
        {/* Icon Display */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/40 to-cyan-400/40 rounded-2xl blur-sm opacity-70 group-hover:opacity-100 transition-all duration-500 animate-breath"></div>
            <div className="w-16 h-16 rounded-2xl bg-[#1E293B]/90 relative z-10 border border-indigo-500/30 shadow-lg flex items-center justify-center group">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              <MessageSquare className="w-8 h-8 text-indigo-400 group-hover:text-indigo-300 transition-colors duration-300 group-hover:animate-subtle-bounce" />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent animate-gradient bg-300%">
          Welcome to ConnectChat
        </h2>
        <p className="text-base-content/60 hover:text-base-content/80 transition-colors duration-300">
          Select a conversation from the sidebar to start chatting with your
          contacts
        </p>

        <div className="pt-4 text-sm text-base-content/50">
          <div className="flex items-center justify-center gap-2 group">
            <div className="p-2 rounded-full bg-[#1E293B]/50 group-hover:bg-[#334155]/50 transition-colors duration-300">
              <Users className="w-4 h-4 text-indigo-400 group-hover:text-cyan-400 transition-colors duration-300" />
            </div>
            <span className="group-hover:text-base-content/70 transition-colors duration-300">
              Click on any contact to begin
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoChatSelected;
