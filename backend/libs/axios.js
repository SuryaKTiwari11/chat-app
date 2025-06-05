import axios from 'axios';
export const axiosInstance = axios.create({
    baseURL: process.env.API_BASE_URL || 'http://localhost:3000/api',
    withCredentials: true,
)