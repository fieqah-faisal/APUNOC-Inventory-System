import { UserRole } from '../types';

export const permissions = {
  canManageUsers: (role: UserRole) => role === 'super-admin',
  canManageSystemSettings: (role: UserRole) => role === 'super-admin',
  canViewAuditLogs: (role: UserRole) => role === 'super-admin',
  canManageCategories: (role: UserRole) => ['super-admin', 'admin'].includes(role),
  canManageSites: (role: UserRole) => ['super-admin', 'admin'].includes(role),
  canImportExcel: (role: UserRole) => ['super-admin', 'admin'].includes(role),
  canDeleteAssets: (role: UserRole) => ['super-admin', 'admin'].includes(role),
  canRetireAssets: (role: UserRole) => true, // All roles can retire
  canCreateAssets: (role: UserRole) => true, // All roles can create
  canUpdateAssets: (role: UserRole) => true, // All roles can update
  canViewLogs: (role: UserRole) => ['super-admin', 'admin'].includes(role),
  canViewFullDashboard: (role: UserRole) => ['super-admin', 'admin'].includes(role),
};

export const getRoleBadgeColor = (role: UserRole) => {
  const colors = {
    'super-admin': 'bg-purple-100 text-purple-800 border-purple-200',
    'admin': 'bg-blue-100 text-blue-800 border-blue-200',
    'operator': 'bg-green-100 text-green-800 border-green-200',
  };
  return colors[role];
};

export const getRoleLabel = (role: UserRole) => {
  const labels = {
    'super-admin': 'Super Admin',
    'admin': 'Admin',
    'operator': 'Operator',
  };
  return labels[role];
};
