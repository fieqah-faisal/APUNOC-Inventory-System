export type UserRole = "super-admin" | "admin" | "operator";

export interface AppUser {
    uid: string;
    username: string;
    email: string;
    role: UserRole;
    status?: "active" | "inactive";
    createdAt: unknown; //Firestore timestamp
    lastLogin: unknown; //Firestore timestamp
}