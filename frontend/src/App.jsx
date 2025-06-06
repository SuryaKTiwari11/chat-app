import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
        />
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

export default App;
