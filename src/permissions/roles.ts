import { AppUser } from "../models/User";

export const isSuperAdmin = (user: AppUser | null): boolean =>
  user?.role === "super-admin";

export const isAdmin = (user: AppUser | null): boolean =>
  user?.role === "admin" || user?.role === "super-admin";

export const isOperator = (user: AppUser | null): boolean =>
  user?.role === "operator";