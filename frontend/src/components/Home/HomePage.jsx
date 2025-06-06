import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Layout/Navbar";
import Footer from "../Layout/Footer";

const HomePage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Add animation after component mounts
    setIsLoaded(true);
  }, []);

  return ( <>
      <Navbar />  
    <div className="min-h-screen bg-[#0F172A] text-white">

      {/* Hero Section with animated elements */}
      <section className="pt-32 pb-24 relative overflow-hidden">

        {/* Background gradient blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-1/4 -left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 right-0 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative">
          <div
            className={`flex flex-col md:flex-row items-center transition-all duration-1000 ease-out ${
              isLoaded
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="md:w-1/2 mb-12 md:mb-0">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
                Connect Instantly.{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 animate-gradient">
                  Chat Freely.
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-lg">
                Experience seamless communication with a modern, sleek interface
                designed for both personal and professional conversations.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/signup"
                  className="px-8 py-3.5 text-center rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-medium hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 ease-in-out hover:scale-105"
                >
                  Get Started
                </Link>
                <Link
                  to="/features"
                  className="px-8 py-3.5 text-center rounded-xl bg-[#1E293B] hover:bg-[#334155] border border-gray-700 transition-all duration-300 ease-in-out group"
                >
                  <span className="flex items-center justify-center">
                    Learn More
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Animated gradient blur behind image */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-500 blur-2xl opacity-30 rounded-3xl animate-pulse"></div>

                {/* Main image with subtle float animation */}
                <div
                  className={`relative transition-all duration-1000 delay-300 transform ${
                    isLoaded
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                >
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/2665/2665393.png"
                    alt="Chat Illustration"
                    className="relative w-full animate-float"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with cards */}
      <section className="py-20 bg-[#1E293B] relative">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Why Choose{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                ConnectChat?
              </span>
            </h2>
            <p className="text-xl text-gray-300">
              Advanced features that make your messaging experience seamless,
              secure, and enjoyable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <FeatureCard
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-[#4F46E5]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              }
              title="End-to-End Encryption"
              description="Your conversations are secured with state-of-the-art encryption. Only you and your recipient can read what's sent."
              bgColor="bg-indigo-900/30"
              delay={100}
            />

            {/* Feature Card 2 */}
            <FeatureCard
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-[#06B6D4]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
              }
              title="Real-Time Messaging"
              description="Send and receive messages instantly with typing indicators and read receipts for a smooth conversation flow."
              bgColor="bg-cyan-900/30"
              delay={200}
            />

            {/* Feature Card 3 */}
            <FeatureCard
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-[#4F46E5]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              }
              title="Group Conversations"
              description="Create groups for teams, friends, or communities with advanced permissions and administration controls."
              bgColor="bg-indigo-900/30"
              delay={300}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[#0F172A]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard number="10M+" label="Active Users" />
            <StatCard number="99.9%" label="Uptime" />
            <StatCard number="50+" label="Countries" />
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-[#1E293B]">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="relative mb-6 inline-block">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-indigo-400 rounded-full opacity-30 blur-sm"></div>
              <div className="relative bg-[#0F172A] p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-cyan-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
            </div>
            <blockquote className="text-2xl font-medium text-gray-200 mb-8">
              "ConnectChat has revolutionized the way our team communicates. The
              interface is clean, the features are robust, and the security
              gives us peace of mind."
            </blockquote>
            <div className="flex items-center justify-center">
              <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-indigo-500 mr-4">
                <img
                  src="https://randomuser.me/api/portraits/women/87.jpg"
                  alt="User"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="text-left">
                <h4 className="font-semibold">Sarah Johnson</h4>
                <p className="text-gray-400 text-sm">CTO, TechNova</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#0F172A] relative">
        <div className="container mx-auto px-6">
          <div className="relative bg-gradient-to-br from-[#1E293B] to-[#334155] rounded-2xl p-8 md:p-12 shadow-2xl overflow-hidden">
            {/* Gradient orbs */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl"></div>

            {/* Content */}
            <div className="max-w-3xl mx-auto text-center relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to start chatting?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Sign up now and connect with your friends, colleagues, and loved
                ones in seconds.
              </p>
              <Link
                to="/signup"
                className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-semibold transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/30"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
      <Footer />
      </>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description, bgColor, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`bg-[#334155] rounded-xl p-6 transition-all duration-700 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } hover:shadow-xl hover:scale-[1.02]`}
    >
      <div
        className={`w-14 h-14 ${bgColor} rounded-lg flex items-center justify-center mb-4`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ number, label }) => {
  return (
    <div className="bg-[#1E293B] rounded-xl p-8 text-center transform transition-transform hover:scale-105 duration-300">
      <div className="text-4xl md:text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
        {number}
      </div>
      <div className="text-gray-400 text-lg font-medium">{label}</div>
    </div>
  );
};

export default HomePage;
