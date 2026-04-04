import { AppUser } from "../models/User";

export const isSuperAdmin = (user: AppUser | null): boolean =>
  user?.role === "super_admin";

export const isAdmin = (user: AppUser | null): boolean =>
  user?.role === "admin" || user?.role === "super_admin";

export const isOperator = (user: AppUser | null): boolean =>
  user?.role === "operator";