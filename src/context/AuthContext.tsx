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
  authError: string | null;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const loadUserProfile = async (uid: string): Promise<AppUser | null> => {
    const profile = await getUserProfile(uid);
    return profile;
  };

  const refreshUser = async () => {
    const current = auth.currentUser;

    if (!current) {
      setUser(null);
      setAuthError(null);
      return;
    }

    const profile = await loadUserProfile(current.uid);

    if (!profile) {
      setUser(null);
      setAuthError(
        "Your account exists, but your NOC profile has not been provisioned. Please contact an administrator."
      );
      return;
    }

    if (profile.status === "disabled") {
      setUser(null);
      setAuthError(
        "Your account has been disabled. Please contact an administrator."
      );
      return;
    }

    setUser(profile);
    setAuthError(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);

      try {
        if (!firebaseUser) {
          setUser(null);
          setAuthError(null);
          setLoading(false);
          return;
        }

        const profile = await loadUserProfile(firebaseUser.uid);

        if (!profile) {
          await logoutUser();
          setUser(null);
          setAuthError(
            "Your account exists, but your NOC profile has not been provisioned. Please contact an administrator."
          );
          return;
        }

        if (profile.status === "disabled") {
          await logoutUser();
          setUser(null);
          setAuthError(
            "Your account has been disabled. Please contact an administrator."
          );
          return;
        }

        setUser(profile);
        setAuthError(null);

        await updateLastLogin(firebaseUser.uid);
      } catch (error) {
        console.error("Failed to load auth user profile:", error);
        setUser(null);
        setAuthError("Failed to authenticate user. Please try again.");
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
      authError,
      logout: logoutUser,
      refreshUser,
    }),
    [user, loading, authError]
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