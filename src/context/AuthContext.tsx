import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import { AppUser } from "../models/User";
import { getUserProfile, updateLastLogin } from "../services/userService";
import { logoutUser } from "../services/authService";

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserProfile = async (uid: string) => {
    const profile = await getUserProfile(uid);
    setUser(profile);
  };

  const refreshUser = async () => {
    const current = auth.currentUser;
    if (!current) {
      setUser(null);
      return;
    }
    await loadUserProfile(current.uid);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          setUser(null);
          setLoading(false);
          return;
        }

        await loadUserProfile(firebaseUser.uid);
        await updateLastLogin(firebaseUser.uid);
      } catch (error) {
        console.error("Failed to load auth user profile:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      logout: logoutUser,
      refreshUser,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }

  return context;
};