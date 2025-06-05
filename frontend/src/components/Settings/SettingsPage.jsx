// filepath: c:\Users\SURYA\Desktop\chat app\frontend\src\components\Settings\SettingsPage.jsx
import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import Navbar from "../Layout/Navbar";
import Footer from "../Layout/Footer";
import Loader from "../UI/Loader";

const SettingsPage = () => {
  const { authUser } = useAuthStore();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setIsLoaded(true);
  }, []);

  if (!authUser) {
    return <Loader fullScreen size="large" />;
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <Navbar />

      <div className="pt-28 pb-16 px-4">
        <div
          className={`max-w-5xl mx-auto transition-all duration-700 ease-out ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 animate-gradient">
            Settings
          </h1>

          {/* Account Settings Section */}
          <div className="bg-[#1E293B] rounded-2xl p-6 shadow-xl mb-6">
            <div className="flex flex-col gap-1 mb-6">
              <h2 className="text-xl font-semibold flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-indigo-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                Account Settings
              </h2>
              <p className="text-gray-400 ml-7">
                Manage your account preferences
              </p>
            </div>

            <div className="p-5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 mt-4">
              <div className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-3 text-indigo-400 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="font-medium text-indigo-300">
                    Theme Information
                  </p>
                  <p className="mt-1.5 text-gray-400 text-sm leading-relaxed">
                    This application uses our beautiful Premium Dark theme with
                    custom gradients and animations for the best user
                    experience.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Future Settings Section Placeholder */}
          <div className="bg-[#1E293B] rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col gap-1 mb-6">
              <h2 className="text-xl font-semibold flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-cyan-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
                Additional Settings
              </h2>
              <p className="text-gray-400 ml-7">
                More settings will be available in future updates
              </p>
            </div>

            <div className="text-center py-8 text-gray-400">
              <p>
                Stay tuned for more customization options in upcoming releases!
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SettingsPage;
