import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import toast from "react-hot-toast";
//2:14:45
const LoginForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const { login, isLoggingIn } = useAuthStore();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
 
  };

  const validateForm = () => {
    let isValid = true;
    
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

    return isValid;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await login(formData);
      // The auth store will automatically handle token storage and toast notifications
      // No need for manual redirect as App.jsx will handle routing based on auth state
    } catch (error) {
      console.error("Login failed", error);
      setErrors({ form: "Invalid email or password. Please try again." });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.form && (
        <div className="bg-[#F43F5E]/10 border border-[#F43F5E]/30 text-[#F43F5E] px-4 py-3 rounded-lg text-sm">
          {errors.form}
        </div>
      )}

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
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-300"
          >
            Password
          </label>
          <a
            href="#"
            className="text-sm text-[#06B6D4] hover:text-indigo-400 transition-colors duration-300"
          >
            Forgot password?
          </a>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          required
          value={formData.password}
          onChange={handleChange}
          className={`w-full px-4 py-3 bg-[#334155] border ${
            errors.password ? "border-[#F43F5E]" : "border-gray-700"
          } rounded-xl text-white 
          focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition duration-200
          placeholder-gray-500 shadow-sm`}
          placeholder="Enter your password"
        />
        {errors.password && (
          <p className="mt-1 text-xs text-[#F43F5E]">{errors.password}</p>
        )}
      </div>

      <div className="flex items-center">
        <input
          id="rememberMe"
          name="rememberMe"
          type="checkbox"
          checked={formData.rememberMe}
          onChange={handleChange}
          className="h-4 w-4 rounded border-gray-700 bg-[#334155] text-[#4F46E5] focus:ring-[#4F46E5]"
        />
        <label
          htmlFor="rememberMe"
          className="ml-2 block text-sm text-gray-300"
        >
          Remember me
        </label>
      </div>

      <div>        <button
          type="submit"
          disabled={isLoggingIn}
          className="w-full flex justify-center py-3 px-4 rounded-xl bg-[#4F46E5] hover:bg-indigo-600 
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4F46E5] shadow-lg
          text-white font-medium transition duration-300 ease-in-out hover:scale-[1.02]
          disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoggingIn ? (
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
              Signing in...
            </span>
          ) : (
            "Sign in"
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
              Or continue with
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

export default LoginForm;
