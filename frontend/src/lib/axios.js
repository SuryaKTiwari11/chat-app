import axios from "axios";

// Vite automatically loads environment variables from .env files with VITE_ prefix
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const axiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
});
