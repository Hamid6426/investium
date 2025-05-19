"use client";

import React, {
  useState,
  useEffect,
  ReactNode,
  createContext,
  useContext,
} from "react";
import axiosInstance from "@/utils/axiosInstance";

// ============================
// Define types
// ============================

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
  isSecure: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<User>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

// ============================
// AuthProvider component
// ============================

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await axiosInstance.get("/api/profile");
          setUser(res.data.user);
        } catch (error) {
          console.error("Token invalid or fetch failed:", error);
          logout();
        }
      }
      setLoading(false);
    };

    initializeUser();
  }, []);

  const login = async (credentials: {
    email: string;
    password: string;
  }): Promise<User> => {
    try {
      const res = await axiosInstance.post("/api/auth/signin", credentials);
      console.log("Login response:", res.data);

      const token = res.data.token;

      if (!token) {
        throw new Error("Token missing from response");
      }

      // Save token
      localStorage.setItem("token", token);

      // Attach token to axios for future requests
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      // Fetch user profile
      const profileRes = await axiosInstance.get("/api/profile");
      const user = profileRes.data.user;

      if (!user) {
        throw new Error("User not found in profile response");
      }

      setUser(user);
      return user;
    } catch (error: any) {
      console.error(
        "Login failed:",
        error.response?.data || error.message || error
      );
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

// "use client";

// import React, {
//   createContext,
//   useContext,
//   useState,
//   useRef,
//   useEffect,
// } from "react";
// import axiosInstance from "@/utils/axiosInstance";

// // --- Interface: Structure of the authenticated user ---
// interface AuthenticatedUser {
//   _id: string;
//   name: string;
//   email: string;
//   phone: string;
//   role: string;
//   createdAt: string;
//   isSecure: boolean;
// }

// // --- Credentials required to sign in ---
// interface LoginCredentials {
//   email: string;
//   password: string;
// }

// // --- Interface: Shape of the auth context ---
// interface AuthContextProps {
//   isLoadingUser: boolean;
//   currentUser: AuthenticatedUser | null;
//   authToken: string | null;

//   loadUserProfile: () => Promise<void>;
//   login: (credentials: LoginCredentials) => Promise<AuthenticatedUser>;
//   logout: () => void;

//   setCurrentUser: React.Dispatch<
//     React.SetStateAction<AuthenticatedUser | null>
//   >;
//   setAuthToken: React.Dispatch<React.SetStateAction<string | null>>;
// }

// // --- Create the context ---
// const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// // --- Provider component ---
// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(
//     null
//   );
//   const [isLoadingUser, setIsLoadingUser] = useState(true);
//   const [authToken, setAuthToken] = useState<string | null>(null);

//   const hasFetchedProfile = useRef(false);

//   // --- Load the user profile using the token ---
//   const loadUserProfile = async () => {
//     if (typeof window === "undefined") return;

//     setIsLoadingUser(true);
//     const storedToken = localStorage.getItem("token");

//     if (!storedToken) {
//       setCurrentUser(null);
//       setAuthToken(null);
//       setIsLoadingUser(false);
//       return;
//     }

//     try {
//       axiosInstance.defaults.headers.common[
//         "Authorization"
//       ] = `Bearer ${storedToken}`;
//       const res = await axiosInstance.get("/api/profile");

//       setCurrentUser(res.data);
//       setAuthToken(storedToken);
//     } catch (error) {
//       console.error("Failed to load user profile:", error);
//       localStorage.removeItem("token");
//       setCurrentUser(null);
//       setAuthToken(null);
//     } finally {
//       setIsLoadingUser(false);
//     }
//   };

//   // --- Login function ---
//   const login = async (
//     credentials: LoginCredentials
//   ): Promise<AuthenticatedUser> => {
//     const res = await axiosInstance.post("/api/auth/signin", credentials);
//     const token = res.data.token;

//     if (token) {
//       localStorage.setItem("token", token);
//       setAuthToken(token);
//       axiosInstance.defaults.headers.common[
//         "Authorization"
//       ] = `Bearer ${token}`;

//       await loadUserProfile();
//       return res.data.user;
//     }

//     throw new Error("Invalid login response");
//   };

//   // --- Logout function ---
//   const logout = () => {
//     localStorage.removeItem("token");
//     setAuthToken(null);
//     setCurrentUser(null);
//   };

//   // --- Initial load (once) ---
//   useEffect(() => {
//     if (!hasFetchedProfile.current) {
//       hasFetchedProfile.current = true;
//       loadUserProfile();
//     }
//   }, []);

//   return (
//     <AuthContext.Provider
//       value={{
//         isLoadingUser,
//         currentUser,
//         authToken,
//         loadUserProfile,
//         login,
//         logout,
//         setCurrentUser,
//         setAuthToken,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // --- Custom hook to use auth context ---
// export const useAuth = (): AuthContextProps => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within an AuthProvider");
//   return context;
// };
