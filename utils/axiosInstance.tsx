import axios from "axios";

const isDevelopment = process.env.NODE_ENV === "development";

const axiosInstance = axios.create({
  baseURL: isDevelopment
    ? "http://localhost:3000"
    : process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Set Content-Type if not FormData
    if (config.data && !(config.data instanceof FormData)) {
      config.headers = config.headers || {};
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Don't remove token automatically on 401
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Optional: only redirect or show message
      if (typeof window !== "undefined") {
        // You can toast here or redirect, but DON'T remove the token
        // window.location.href = "/signin"; // Optional
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
