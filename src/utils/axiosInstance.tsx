import axios from "axios";

const isDevelopment = process.env.NODE_ENV === "development";

const axiosInstance = axios.create({
  baseURL: isDevelopment
    ? "http://localhost:3000/api"
    : process.env.NEXT_PUBLIC_BASE_API_URL,
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const authToken =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    if (authToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${authToken}`;
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

export default axiosInstance;
