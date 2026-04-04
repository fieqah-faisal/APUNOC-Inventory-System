import { AppUser } from "../models/User";
import { isAdmin, isOperator, isSuperAdmin } from "./roles";

export const canManageUsers = (user: AppUser | null): boolean =>
  isAdmin(user);

export const canViewAuditLogs = (user: AppUser | null): boolean =>
  isAdmin(user);

export const canImportInventory = (user: AppUser | null): boolean =>
  isOperator(user) || isAdmin(user);

export const canRetireAsset = (user: AppUser | null): boolean =>
  isOperator(user) || isAdmin(user);

export const canArchiveAsset = (user: AppUser | null): boolean =>
  isAdmin(user);

export const canHardDeleteAsset = (user: AppUser | null): boolean =>
  isSuperAdmin(user);

export const canChangeDeployedAssetLocation = (user: AppUser | null): boolean =>
  isAdmin(user);

export const canEditAssetAdminFields = (user: AppUser | null): boolean =>
  isAdmin(user);

export const canEditAssetOperationalFields = (user: AppUser | null): boolean =>
  isOperator(user) || isAdmin(user);

export const canManageLocations = (user: AppUser | null): boolean =>
  isAdmin(user);

export const canCreateAssets = (user: AppUser | null): boolean =>
  isOperator(user) || isAdmin(user);

export const canEditConsumables = (user: AppUser | null): boolean =>
  isOperator(user) || isAdmin(user);