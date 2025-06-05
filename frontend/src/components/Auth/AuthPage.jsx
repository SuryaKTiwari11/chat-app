import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import Navbar from "../Layout/Navbar";

const AuthPage = ({ authMode: initialAuthMode = "login" }) => {
  const [authMode, setAuthMode] = useState(initialAuthMode);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  // Update the authMode if the prop changes (when navigating between /login and /signup)
  useEffect(() => {
    setAuthMode(initialAuthMode);
  }, [initialAuthMode]);

  useEffect(() => {
    // Trigger entrance animation
    setIsLoaded(true);
  }, []);

  const toggleAuthMode = () => {
    const newMode = authMode === "login" ? "signup" : "login";
    setAuthMode(newMode);
    navigate(`/${newMode}`);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <Navbar />

      <div className="pt-24 pb-16 px-4">
        <div className="flex flex-col lg:flex-row max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-2xl">
          {/* Left side - Illustration/Brand */}
          <div className="lg:w-1/2 relative bg-gradient-to-br from-[#1E293B] to-[#0F172A] py-16 px-8 lg:px-12">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
              <div className="absolute top-1/4 -left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-1/3 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
            </div>

            <div
              className={`relative max-w-md mx-auto text-center transition-all duration-1000 ease-out ${
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="mb-8 flex justify-center">
                <div className="inline-flex items-center space-x-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6 text-white"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <Link to="/">
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 animate-gradient">
                      ConnectChat
                    </h1>
                  </Link>
                </div>
              </div>

              <h2 className="text-3xl font-bold mb-6">
                {authMode === "login" ? "Welcome back!" : "Join our community!"}
              </h2>
              <p className="text-xl mb-8 text-gray-300">
                {authMode === "login"
                  ? "Sign in to continue your journey with secure, real-time messaging."
                  : "Create an account and start connecting with friends and colleagues instantly."}
              </p>

              <div className="relative w-full max-w-xs mx-auto mt-12">
                {/* Animated gradient blur behind image */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-500 blur-2xl opacity-30 rounded-3xl"></div>
                <img
                  src={
                    authMode === "login"
                      ? "https://cdn-icons-png.flaticon.com/512/1041/1041916.png"
                      : "https://cdn-icons-png.flaticon.com/512/1256/1256650.png"
                  }
                  alt="Chat illustration"
                  className="relative w-full opacity-90 animate-float"
                />
              </div>

              <div className="mt-12 text-center">
                <Link
                  to="/"
                  className="inline-flex items-center text-gray-300 hover:text-cyan-400 transition-colors duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Return to Home
                </Link>
              </div>
            </div>
          </div>

          {/* Right side - Auth form */}
          <div
            className={`lg:w-1/2 bg-[#1E293B] p-8 lg:p-12 transition-all duration-1000 ease-out delay-300 ${
              isLoaded
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="max-w-md mx-auto">
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold mb-2">
                  {authMode === "login" ? "Sign In" : "Create Account"}
                </h2>
                <p className="text-gray-400">
                  {authMode === "login"
                    ? "Enter your credentials to access your account"
                    : "Fill in your information to get started"}
                </p>
              </div>

              {authMode === "login" ? <LoginForm /> : <SignupForm />}

              <div className="mt-8 text-center">
                <p className="text-gray-400">
                  {authMode === "login"
                    ? "Don't have an account?"
                    : "Already have an account?"}
                  <button
                    onClick={toggleAuthMode}
                    className="ml-2 text-[#06B6D4] hover:text-indigo-400 transition-colors duration-300 font-medium"
                  >
                    {authMode === "login" ? "Sign up now" : "Sign in"}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
