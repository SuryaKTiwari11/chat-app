import React from "react";

const Loader = ({ size = "medium", fullScreen = false }) => {
  // Size configuration
  const sizes = {
    small: { outer: "w-8 h-8", inner: "w-4 h-4", glow: "w-12 h-12" },
    medium: { outer: "w-12 h-12", inner: "w-6 h-6", glow: "w-16 h-16" },
    large: { outer: "w-16 h-16", inner: "w-8 h-8", glow: "w-20 h-20" },
  };

  const selectedSize = sizes[size] || sizes.medium;

  const containerClasses = fullScreen
    ? "fixed inset-0 flex items-center justify-center bg-[#0F172A] z-50"
    : "flex items-center justify-center";

  return (
    <div className={`${containerClasses} animate-fade-in`}>
      <div className="relative">
        {/* Background glow effect */}
        <div
          className={`absolute ${selectedSize.glow} rounded-full bg-indigo-500/10 animate-breath -inset-4 blur-xl`}
        ></div>

        {/* Outer spinning gradient ring */}
        <div
          className={`${selectedSize.outer} rounded-full border-4 border-transparent 
          bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-500 animate-spin-slow 
          flex items-center justify-center relative`}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer bg-[length:200%_100%] rounded-full"></div>

          {/* Inner content to create ring effect */}
          <div className="absolute inset-1 rounded-full bg-[#0F172A]"></div>
        </div>

        {/* Inner pulsing circle */}
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
          ${selectedSize.inner} rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400 
          animate-pulse opacity-80`}
        >
          {/* Inner glow */}
          <div className="absolute inset-0 rounded-full bg-indigo-400/30 animate-glow-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
