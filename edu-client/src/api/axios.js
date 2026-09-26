import axios from 'axios';
import authService from '../services/authService';

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5088/api";

// Public API Requests (e.g., Login, Register)
export const axiosPublic = axios.create({ // <-- 'axiosPublic' export করা হয়েছে
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});

// Private/Protected API Requests (Authorization Header সহ)
export const axiosPrivate = axios.create({ // <-- 'axiosPrivate' export করা হয়েছে
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});

axiosPrivate.interceptors.request.use(
    (config) => {
        const user = authService.getCurrentUser();
        const token = user?.token;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Note: You can also choose to export axiosPrivate as the default,
// but named exports are often better for clarity.
export default axiosPrivate;