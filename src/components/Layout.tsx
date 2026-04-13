import React, { useState } from "react";
import {
  Package,
  LayoutDashboard,
  Box,
  MapPin,
  ScanBarcode,
  History,
  Menu,
  X,
  Bell,
  User,
  Upload,
  Users,
  FileText,
  Building2,
} from "lucide-react";
import {
  canManageUsers,
  canViewAuditLogs,
  canImportInventory,
} from "../permissions/permissions";
import { useAuth } from "../hooks/useAuth";
import { AppUser } from "../models/User";

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onViewChange: (view: string) => void;
  user: AppUser;
}

const getRoleBadgeColor = (role: AppUser["role"]) => {
  switch (role) {
    case "super-admin":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "admin":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "operator":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getRoleLabel = (role: AppUser["role"]) => {
  switch (role) {
    case "super-admin":
      return "Super Admin";
    case "admin":
      return "Admin";
    case "operator":
      return "Operator";
    default:
      return role;
  }
};

const Layout: React.FC<LayoutProps> = ({
  children,
  currentView,
  onViewChange,
  user,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { logout } = useAuth();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, permission: () => true },
    { id: "assets", label: "Assets", icon: Box, permission: () => true },
    { id: "consumables", label: "Consumables", icon: Package, permission: () => true },
    { id: "sites", label: "Sites & Projects", icon: Building2, permission: () => true },
    { id: "locations", label: "Locations", icon: MapPin, permission: () => true },
    { id: "scan", label: "Scan", icon: ScanBarcode, permission: () => true },
    { id: "import", label: "Import", icon: Upload, permission: () => canImportInventory(user) },
    { id: "logs", label: "Movement Logs", icon: History, permission: () => true },
    { id: "users", label: "User Management", icon: Users, permission: () => canManageUsers(user) },
    { id: "audit", label: "Audit Logs", icon: FileText, permission: () => canViewAuditLogs(user) },
  ];

  const visibleMenuItems = menuItems.filter((item) => item.permission());

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="gradient-primary p-2 rounded-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">NOC Inventory</h1>
                <p className="text-xs text-gray-500">Network Operations Center</p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{user.username}</p>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${getRoleBadgeColor(
                      user.role
                    )}`}
                  >
                    {getRoleLabel(user.role)}
                  </span>
                </div>

                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>

                <button
                  onClick={logout}
                  className="ml-2 px-3 py-1 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className={`${mobileMenuOpen ? "block" : "hidden"} lg:block lg:w-64 space-y-1`}>
            <nav className="bg-white rounded-xl p-2 card-shadow">
              {visibleMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onViewChange(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;