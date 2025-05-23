import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "@/utils/axiosInstance";

// Define the shape of the user returned from /profile
interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "admin" | "superadmin";
  image?: string | null;
  agreedToTerms: boolean;
  walletBalance: number;
  isSecured?: boolean | null;
  blockReason?: string | null;
  referralCode: string | null;
  referralEffectExpired?: Date | null;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  setUser: (user: User | null) => void;
  setIsLoggedIn: (loggedIn: boolean) => void;
  fetchUserProfile: () => Promise<User>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  // Define fetchUserProfile OUTSIDE useEffect so it can be exported
  const fetchUserProfile = async (): Promise<User> => {
    try {
      const res = await axiosInstance.get("/profile");
      const userData: User = res.data.user;
      setUser(userData);
      setIsLoggedIn(true);
      return userData;
    } catch (err) {
      localStorage.removeItem("authToken");
      setUser(null);
      setIsLoggedIn(false);
      throw err;
    } finally {
      setLoading(false); // Mark loading as false after fetch attempt
    }
  };

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      setLoading(false); // If there is no token? we need to mark loading done
      return;
    }

    try {
      const decoded: { exp: number } = jwtDecode(authToken);
      if (decoded.exp * 1000 < Date.now()) {
        throw new Error("Token expired");
      }
      // Call the global fetchUserProfile function
      fetchUserProfile();
    } catch (err) {
      console.error("Invalid or expired token", err);
      localStorage.removeItem("authToken");
      setUser(null);
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        loading,
        setUser,
        setIsLoggedIn,
        fetchUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
