import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import toast from "react-hot-toast";

const SignupForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({});

  const { signup, isSigningUp } = useAuthStore();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    // Clear errors when user types
  };

  const validateForm = () => {
    let isValid = true;
    // Name validation
    if (!formData.fullname.trim()) {
      toast.error("Full name is required");
      isValid = false;
    }

    // Email validation
    if (!formData.email) {
      toast.error("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Email address is invalid");
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      toast.error("Password is required");
      isValid = false;
    } else if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      isValid = false;
    }

    // Terms validation
    if (!formData.agreeToTerms) {
      toast.error("You must agree to the terms and conditions");
      isValid = false;
    }

    return isValid;
  };  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await signup(formData);
      
      // Show message directing user to login with a longer duration
      toast.success(
        "Account created successfully! You will be redirected to login page...", 
        { duration: 5000 } // Show for 5 seconds
      );
      
      // Add a small delay before redirecting to ensure the toast is visible
      setTimeout(() => {
        // The auth store will handle the actual redirection
      }, 1500);
    } catch (error) {
      console.error("Signup failed", error);
      setErrors({ form: error?.response?.data?.message || "Registration failed. Please try again." });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errors.form && (
        <div className="bg-[#F43F5E]/10 border border-[#F43F5E]/30 text-[#F43F5E] px-4 py-3 rounded-lg text-sm">
          {errors.form}
        </div>
      )}
      <div>
        <label
          htmlFor="fullname"
          className="block text-sm font-medium text-gray-300 mb-1"
        >
          Full Name
        </label>
        <input
          id="fullname"
          name="fullname"
          type="text"
          required
          value={formData.fullname}
          onChange={handleChange}
          className={`w-full px-4 py-3 bg-[#334155] border ${
            errors.fullname ? "border-[#F43F5E]" : "border-gray-700"
          } rounded-xl text-white 
          focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition duration-200
          placeholder-gray-500 shadow-sm`}
          placeholder="Enter your full name"
        />
        {errors.fullname && (
          <p className="mt-1 text-xs text-[#F43F5E]">{errors.fullname}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-300 mb-1"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-4 py-3 bg-[#334155] border ${
            errors.email ? "border-[#F43F5E]" : "border-gray-700"
          } rounded-xl text-white 
          focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition duration-200
          placeholder-gray-500 shadow-sm`}
          placeholder="Enter your email"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-[#F43F5E]">{errors.email}</p>
        )}
      </div>{" "}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-300 mb-1"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-[#334155] border ${
              errors.password ? "border-[#F43F5E]" : "border-gray-700"
            } rounded-xl text-white 
            focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition duration-200
            placeholder-gray-500 shadow-sm pr-10`}
            placeholder="Create a password (min. 6 characters)"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white focus:outline-none"
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            )}
          </button>
        </div>
        {errors.password ? (
          <p className="mt-1 text-xs text-[#F43F5E]">{errors.password}</p>
        ) : (
          <p className="mt-1 text-xs text-gray-400">
            Password must be at least 6 characters long
          </p>
        )}
      </div>
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="agreeToTerms"
            name="agreeToTerms"
            type="checkbox"
            checked={formData.agreeToTerms}
            onChange={handleChange}
            required
            className={`h-4 w-4 rounded border-gray-700 bg-[#334155] text-[#4F46E5] focus:ring-[#4F46E5] ${
              errors.agreeToTerms
                ? "border-[#F43F5E] ring-1 ring-[#F43F5E]"
                : ""
            }`}
          />
        </div>
        <div className="ml-3 text-sm">
          <label
            htmlFor="agreeToTerms"
            className={`text-gray-300 ${
              errors.agreeToTerms ? "text-[#F43F5E]" : ""
            }`}
          >
            I agree to the{" "}
            <a
              href="#"
              className="text-[#06B6D4] hover:text-indigo-400 transition-colors duration-300"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-[#06B6D4] hover:text-indigo-400 transition-colors duration-300"
            >
              Privacy Policy
            </a>
          </label>
          {errors.agreeToTerms && (
            <p className="mt-1 text-xs text-[#F43F5E]">{errors.agreeToTerms}</p>
          )}
        </div>
      </div>
      <div>
        <button
          type="submit"
          disabled={isSigningUp}
          className="w-full flex justify-center py-3 px-4 rounded-xl bg-[#4F46E5] hover:bg-indigo-600 
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4F46E5] shadow-lg
          text-white font-medium transition duration-300 ease-in-out hover:scale-[1.02]
          disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSigningUp ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Creating account...
            </span>
          ) : (
            "Create Account"
          )}
        </button>
      </div>
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-[#1E293B] text-gray-400">
              Or sign up with
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            className="flex items-center justify-center py-2.5 px-4 rounded-xl bg-[#1E293B] border border-gray-700 
            hover:bg-[#2C3B52] transition duration-300 ease-in-out focus:ring-2 focus:ring-offset-1 focus:ring-[#4F46E5]"
          >
            <svg
              className="h-5 w-5 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </button>
          <button
            type="button"
            className="flex items-center justify-center py-2.5 px-4 rounded-xl bg-[#1E293B] border border-gray-700 
            hover:bg-[#2C3B52] transition duration-300 ease-in-out focus:ring-2 focus:ring-offset-1 focus:ring-[#4F46E5]"
          >
            <svg
              className="h-5 w-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 2.836c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.699 1.028 1.592 1.028 2.683 0 3.841-2.337 4.687-4.565 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10c0-5.523-4.477-10-10-10z"
                clipRule="evenodd"
              />
            </svg>
            GitHub
          </button>
        </div>
      </div>
    </form>
  );
};

export default SignupForm;
