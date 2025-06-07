import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import HomePage from "./components/Home/HomePage";
import AuthPage from "./components/Auth/AuthPage";
import ProfilePage from "./components/Profile/ProfilePage";
import SettingsPage from "./components/Settings/SettingsPage";
import Loader from "./components/UI/Loader";
import { useAuthStore } from "./store/useAuthStore";
import { Toaster } from "react-hot-toast";
import ChatPage from "./components/Home/ChatPage";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    // Check if user is already authenticated
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (authUser) {
      console.log("User authenticated:", authUser);
      console.log("Online users:", onlineUsers);
    }
  }, [authUser, onlineUsers]);
  
  // Listen for profile update events to refresh UI
  useEffect(() => {
    const handleProfileUpdated = (event) => {
      console.log("Profile updated event received:", event.detail);
      // Force reload images that might be cached
      const oldProfilePic = event.detail.previousData?.profilePic;
      const newProfilePic = event.detail.updatedData?.profilePic;
      
      if (oldProfilePic && newProfilePic && oldProfilePic !== newProfilePic) {
        const timestamp = new Date().getTime();
        document.querySelectorAll('img[src="' + oldProfilePic + '"]').forEach(img => {
          img.src = newProfilePic.includes('?') 
            ? `${newProfilePic}&t=${timestamp}` 
            : `${newProfilePic}?t=${timestamp}`;
        });
      }
    };
    
    window.addEventListener('profileUpdated', handleProfileUpdated);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdated);
  }, []);
  
  // Additional check on route changes or when components mount
  useEffect(() => {
    // Create a function to synchronize all profile images with the current authUser
    const syncProfileImages = () => {
      if (authUser?.profilePic) {
        // Find all image elements that might be showing the profile pic but have older URLs
        // This is a catch-all to ensure consistency
        document.querySelectorAll('img').forEach(img => {
          const alt = img.getAttribute('alt');
          const isProfilePic = 
            (alt === authUser.fullname || alt === `${authUser.fullname || "User"}` || alt === "profile pic") &&
            img.src !== authUser.profilePic && 
            !img.src.includes(authUser.profilePic);
          
          if (isProfilePic) {
            const timestamp = new Date().getTime();
            img.src = authUser.profilePic.includes('?') 
              ? `${authUser.profilePic}&t=${timestamp}` 
              : `${authUser.profilePic}?t=${timestamp}`;
          }
        });
      }
    };
    
    // Run the sync when authUser changes or on route changes
    if (authUser) {
      // Small timeout to ensure DOM is ready
      setTimeout(syncProfileImages, 300);
    }
  }, [authUser, location?.pathname]);
  
  if (isCheckingAuth && !authUser) {
    return <Loader fullScreen size="large" />;
  }
  return (
    <div
      id="app-container"
      data-theme="premium-dark"
      className="min-h-screen bg-base-100 text-base-content"
    >
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={authUser ? <Navigate to="/chat" replace /> : <HomePage />}
        />

        {/* Protected Routes - Require Authentication */}
        <Route
          path="/chat"
          element={authUser ? <ChatPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/settings"
          element={
            authUser ? <SettingsPage /> : <Navigate to="/login" replace />
          }
        />        <Route
          path="/profile"
          element={
            authUser ? <ProfilePage /> : <Navigate to="/login" replace />
          }
        />
        {/* Keep the parameterized route for viewing other users' profiles */}
        <Route
          path="/profile/:userId"
          element={
            authUser ? <ProfilePage /> : <Navigate to="/login" replace />
          }
        />

        {/* Auth Routes - Redirect if already authenticated */}
        <Route
          path="/login"
          element={
            authUser ? (
              <Navigate to="/chat" replace />
            ) : (
              <AuthPage authMode="login" />
            )
          }
        />
        <Route
          path="/signup"
          element={
            authUser ? (
              <Navigate to="/chat" replace />
            ) : (
              <AuthPage authMode="signup" />
            )
          }
        />

        {/* Fallback/Not Found Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="top-right" />
    </div>
  );
};

const AppWrapper = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default AppWrapper;
