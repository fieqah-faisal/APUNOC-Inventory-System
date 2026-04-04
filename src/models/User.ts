import { Timestamp } from "firebase/firestore";
import { UserRole, UserStatus } from "./enums";

export interface AppUser {
  uid: string;
  username: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Timestamp | null;
  createdBy: string;
  lastLogin: Timestamp | null;
  tempPasswordSetByAdmin: boolean;
}