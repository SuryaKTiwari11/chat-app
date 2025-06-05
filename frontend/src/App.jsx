import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./components/Home/HomePage";
import AuthPage from "./components/Auth/AuthPage";
import ProfilePage from "./components/Profile/ProfilePage";
import SettingsPage from "./components/Settings/SettingsPage";
import Loader from "./components/UI/Loader";
import { useAuthStore } from "./store/useAuthStore";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    // Check if user is already authenticated
    checkAuth();
  }, [checkAuth]);

  console.log(authUser);
  if (isCheckingAuth && !authUser) {
    return <Loader fullScreen size="large" />;
  }

  return (
    <div id="app-container" data-theme="premium-dark" className="min-h-screen bg-base-100 text-base-content">
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />

          {/* Protected Routes - Require Authentication */}
          <Route
            path="/dashboard"
            element={authUser ? <HomePage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/profile"
            element={
              authUser ? <ProfilePage /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/settings"
            element={
              authUser ? <SettingsPage /> : <Navigate to="/login" replace />
            }
          />

          {/* Auth Routes - Redirect if already authenticated */}
          <Route
            path="/login"
            element={
              authUser ? (
                <Navigate to="/" replace />
              ) : (
                <AuthPage authMode="login" />
              )
            }
          />
          <Route
            path="/signup"
            element={
              authUser ? (
                <Navigate to="/" replace />
              ) : (
                <AuthPage authMode="signup" />
              )
            }
          />

          {/* Fallback/Not Found Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-right" />
      </BrowserRouter>
    </div>
  );
};

export default App;
