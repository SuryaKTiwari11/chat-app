import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import toast from "react-hot-toast";

const Navbar = () => {
  const { authUser, logout } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleLogout = async () => {
    try {
      await logout();
      // Toast notification is handled in the logout function in useAuthStore
      console.log("Logout initiated successfully");
      setIsUserMenuOpen(false); // Close the user menu
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Couldn't log out. Please try again.");
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "py-3 bg-[#0F172A]/80 backdrop-blur-md shadow-lg"
          : "py-5 bg-transparent"
      }`}
    >
      {" "}
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          {" "}
          {/* Logo with Enhanced Animations */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              {/* Animated background glow */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500/50 to-cyan-400/50 rounded-lg blur-lg opacity-70 group-hover:opacity-100 transition-all duration-500 animate-breath"></div>

              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/40 transition-all duration-300 animate-glow-pulse relative z-10 group-hover:animate-hover-lift">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 text-white group-hover:animate-subtle-bounce"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 animate-gradient relative z-10">
              <span className="inline-block hover:animate-subtle-bounce transition-all duration-300">
                C
              </span>
              <span className="inline-block hover:animate-subtle-bounce transition-all duration-300 delay-75">
                o
              </span>
              <span className="inline-block hover:animate-subtle-bounce transition-all duration-300 delay-100">
                n
              </span>
              <span className="inline-block hover:animate-subtle-bounce transition-all duration-300 delay-150">
                n
              </span>
              <span className="inline-block hover:animate-subtle-bounce transition-all duration-300 delay-200">
                e
              </span>
              <span className="inline-block hover:animate-subtle-bounce transition-all duration-300 delay-75">
                c
              </span>
              <span className="inline-block hover:animate-subtle-bounce transition-all duration-300 delay-100">
                t
              </span>
              <span className="inline-block hover:animate-subtle-bounce transition-all duration-300 delay-150">
                C
              </span>
              <span className="inline-block hover:animate-subtle-bounce transition-all duration-300 delay-200">
                h
              </span>
              <span className="inline-block hover:animate-subtle-bounce transition-all duration-300 delay-75">
                a
              </span>
              <span className="inline-block hover:animate-subtle-bounce transition-all duration-300 delay-100">
                t
              </span>
            </h1>
          </Link>
          {/* Desktop Navigation Links - Only show when user is not logged in */}
          {!authUser && (
            <div className="hidden md:flex items-center space-x-1">
              <NavLink to="/" isActive={isActive("/")}>
                Home
              </NavLink>
              <NavLink to="/features" isActive={isActive("/features")}>
                Features
              </NavLink>
              <NavLink to="/pricing" isActive={isActive("/pricing")}>
                Pricing
              </NavLink>
            </div>
          )}
          {/* Desktop Auth Buttons or User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {!authUser ? (
              <>
                {" "}
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-white hover:text-cyan-400 transition-all duration-300 relative group overflow-hidden"
                >
                  <span className="relative z-10">Login</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-400 to-cyan-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white rounded-xl shadow-md hover:shadow-indigo-500/50 hover:scale-105 transition-all duration-300 relative overflow-hidden before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-r before:from-indigo-600 before:to-cyan-600 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100 before:-z-10"
                >
                  <span className="relative z-10">Get Started</span>
                </Link>
              </>
            ) : (
              <div className="relative" ref={userMenuRef}>
                {" "}
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 focus:outline-none group"
                >
                  <div className="relative">
                    {/* Subtle animated border */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full blur opacity-70 group-hover:opacity-100 transition-all duration-300 animate-spin-slow"></div>

                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-500 relative z-10 group-hover:border-cyan-400 transition-colors duration-300 group-hover:shadow-lg group-hover:shadow-cyan-500/20">
                      {authUser.profilePic ? (
                        <img
                          src={authUser.profilePic}
                          alt={authUser.fullname || "User"}
                          className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-semibold animate-gradient bg-300%">
                          {(authUser.fullname || "U").charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="hidden lg:block">
                    {authUser.fullname || "User"}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 transition-transform duration-200 ${
                      isUserMenuOpen ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>{" "}
                {/* Dropdown Menu */}
                <div
                  className={`absolute right-0 mt-2 w-56 bg-[#1E293B] rounded-xl shadow-lg py-2 z-50 transform origin-top-right transition-all duration-200 ${
                    isUserMenuOpen
                      ? "opacity-100 scale-100 animate-scale-reveal"
                      : "opacity-0 scale-95 pointer-events-none"
                  }`}
                >
                  <div className="px-4 py-2 border-b border-gray-700">
                    <p className="text-sm text-gray-400">Signed in as</p>
                    <p className="text-white font-medium truncate">
                      {authUser.email}
                    </p>
                  </div>{" "}
                  <Link
                    to="/profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="block px-4 py-2 text-white hover:bg-[#334155] transition-all duration-200 group"
                  >
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-gray-400 group-hover:text-indigo-400 transition-colors duration-200"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        Your Profile
                      </span>
                    </div>
                  </Link>{" "}
                  <Link
                    to="/settings"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="block px-4 py-2 text-white hover:bg-[#334155] transition-all duration-200 group"
                  >
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-gray-400 group-hover:text-indigo-400 transition-colors duration-200 group-hover:animate-spin-slow"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        Settings
                      </span>
                    </div>{" "}
                  </Link>
                  <div className="border-t border-gray-700 my-2"></div>{" "}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-white hover:bg-[#334155] transition-all duration-200 group"
                  >
                    <div className="flex items-center text-red-400 hover:text-red-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 group-hover:-translate-x-1 group-hover:translate-y-1 transition-transform duration-300"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414a1 1 0 00-.293-.707L11.414 2.414A1 1 0 0010.707 2H4a1 1 0 00-1 1zm9 2.414L15.586 9H12V5.414zM4 4h5v5h5v6H4V4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="relative overflow-hidden">
                        <span className="group-hover:opacity-0 transition-opacity duration-200">
                          Logout
                        </span>
                        <span className="absolute left-0 top-0 -translate-y-full group-hover:translate-y-0 transition-transform duration-200 text-red-300">
                          Logout
                        </span>
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>{" "}
          {/* Mobile Menu Button with Animation */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white focus:outline-none relative group"
            aria-label="Toggle menu"
          >
            <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500/20 to-cyan-400/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            {!isMobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 transition-all duration-300 group-hover:text-cyan-400 group-active:scale-90"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 transition-all duration-300 group-hover:text-cyan-400 group-active:scale-90 animate-pulse-once"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-[#1E293B] border-t border-gray-800 transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        {" "}
        <div className="container mx-auto px-6 py-4 space-y-3">
          {/* Only show Home/Features/Pricing when not logged in */}
          {!authUser && (
            <>
              <MobileNavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>
                Home
              </MobileNavLink>
              <MobileNavLink
                to="/features"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </MobileNavLink>
              <MobileNavLink
                to="/pricing"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </MobileNavLink>
            </>
          )}

          {authUser ? (
            <>
              {/* User info section */}{" "}
              <div className="pt-4 border-t border-gray-700 flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full blur opacity-60 animate-breath"></div>
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-500 relative z-10 animate-hover-lift">
                    {authUser.profilePic ? (
                      <img
                        src={authUser.profilePic}
                        alt={authUser.fullname || "User"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-semibold animate-gradient bg-300%">
                        {(authUser.fullname || "U").charAt(0)}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-white font-medium">
                    {authUser.fullname || "User"}
                  </p>
                  <p className="text-gray-400 text-sm truncate">
                    {authUser.email}
                  </p>
                </div>
              </div>
              <MobileNavLink
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Profile
              </MobileNavLink>{" "}
              <MobileNavLink
                to="/settings"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Settings{" "}
              </MobileNavLink>
              <div className="pt-3">
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-2.5 text-red-400 hover:bg-[#334155] rounded-lg transition duration-300 text-left flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414a1 1 0 00-.293-.707L11.414 2.414A1 1 0 0010.707 2H4a1 1 0 00-1 1zm9 2.414L15.586 9H12V5.414zM4 4h5v5h5v6H4V4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="pt-4 border-t border-gray-700">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-2.5 text-white hover:bg-[#334155] rounded-lg transition duration-300"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block mt-3 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white rounded-lg shadow-md text-center"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

// Desktop Nav Link Component with Enhanced Animation
const NavLink = ({ children, to, isActive }) => {
  return (
    <Link
      to={to}
      className={`relative px-4 py-2 font-medium transition-all duration-300 rounded-xl 
      hover:text-cyan-400 group overflow-hidden ${
        isActive ? "text-cyan-400" : "text-white"
      }`}
    >
      {/* Animated glow effect on hover */}
      <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 blur transition-opacity duration-300"></span>

      {/* Text with subtle bounce animation */}
      <span className="relative z-10 block group-hover:animate-subtle-bounce">
        {children}
      </span>

      {/* Bottom line animation */}
      <span
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-indigo-400 to-cyan-400
        transition-all duration-300 group-hover:w-1/2 group-hover:animate-pulse
        ${isActive ? "w-1/2" : "w-0"}`}
      ></span>
    </Link>
  );
};

// Mobile Nav Link Component with Animation
const MobileNavLink = ({ children, to, onClick }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block px-4 py-2.5 text-white hover:bg-[#334155] rounded-lg transition duration-300 group relative overflow-hidden"
    >
      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-indigo-500 to-cyan-400 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
      <div className="relative z-10 flex items-center group-hover:translate-x-2 transition-transform duration-300">
        {children}
      </div>
    </Link>
  );
};

export default Navbar;
