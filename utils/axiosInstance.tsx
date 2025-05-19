import axios from "axios";

const isDevelopment = process.env.NODE_ENV === "development";

const axiosInstance = axios.create({
  baseURL: isDevelopment
    ? "http://localhost:3000" // Local dev server
    : process.env.NEXT_PUBLIC_API_BASE_URL, // Production API URL
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

    // Set Content-Type to JSON only if data is not FormData
    if (config.data && !(config.data instanceof FormData)) {
      config.headers = config.headers || {};
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/signin"; // or use router.push if using Next.js router
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
