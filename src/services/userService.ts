import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { AppUser } from "../models/User";
import { UserRole } from "../models/enums";

const USERS_COLLECTION = "users";

export const createUserProfile = async (params: {
  uid: string;
  username: string;
  email: string;
  role?: UserRole;
  createdBy: string;
  tempPasswordSetByAdmin?: boolean;
}) => {
  const {
    uid,
    username,
    email,
    role = "operator",
    createdBy,
    tempPasswordSetByAdmin = true,
  } = params;

  await setDoc(doc(db, USERS_COLLECTION, uid), {
    username,
    email,
    role,
    status: "active",
    createdAt: serverTimestamp(),
    createdBy,
    lastLogin: null,
    tempPasswordSetByAdmin,
  });
};

export const getUserProfile = async (uid: string): Promise<AppUser | null> => {
  const snap = await getDoc(doc(db, USERS_COLLECTION, uid));
  if (!snap.exists()) return null;

  const data = snap.data();

  return {
    uid,
    username: data.username ?? "",
    email: data.email ?? "",
    role: data.role ?? "operator",
    status: data.status ?? "active",
    createdAt: data.createdAt ?? null,
    createdBy: data.createdBy ?? "",
    lastLogin: data.lastLogin ?? null,
    tempPasswordSetByAdmin: data.tempPasswordSetByAdmin ?? false,
  };
};

export const updateLastLogin = async (uid: string) => {
  await updateDoc(doc(db, USERS_COLLECTION, uid), {
    lastLogin: serverTimestamp(),
  });
};