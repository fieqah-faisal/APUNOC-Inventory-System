import {
    doc,
    getDoc,
    serverTimestamp,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import {db} from "../config/firebase";
import {AppUser,UserRole} from "../models/User";

const USERS_COLLECTION = "users";

export const createUserProfile = async (params: {
    uid: string;
    username: string;
    email: string;
    role?: UserRole;
}) => {
    const {uid, username, email, role = "operator"} = params;
    await setDoc(doc(db, USERS_COLLECTION, uid), {
        username, 
        email,
        role,
        status: "active",
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
    });
};

export const getUserProfile = async (uid:string): Promise<AppUser | null> => {
    const snap = await getDoc(doc(db, USERS_COLLECTION, uid));
    if (!snap.exists()) return null;

    const data = snap.data();
    return {
        uid,
        username: data.username ?? "",
        email: data.email ?? "",
        role: data.role ?? "operator",
        status: data.status ?? "inactive",
        createdAt: data.createdAt,
        lastLogin: data.lastLogin,
    } as AppUser;
};

export const updateLastLogin = async (uid:string) => {
    await updateDoc(doc(db, USERS_COLLECTION, uid), {
        lastLogin: serverTimestamp(),
    });
}