import React, { useEffect, useState } from "react";
import { Users, Plus, Edit2, Lock, Unlock, Shield } from "lucide-react";
import { AppUser } from "../models/User";
import { getUsers } from "../services/userService";

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

const formatTimestamp = (value: any) => {
  if (!value) return "Never";
  try {
    if (typeof value.toDate === "function") {
      return value.toDate().toLocaleDateString();
    }
    return new Date(value).toLocaleDateString();
  } catch {
    return "Invalid date";
  }
};

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  if (loading) {
    return <div className="p-6">Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 card-shadow">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Users className="w-7 h-7 mr-3 text-purple-600" />
              User Management
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage user accounts and permissions
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="gradient-primary text-white font-semibold px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center justify-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New User
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user.uid}
            className={`bg-white rounded-xl p-6 card-shadow hover:card-shadow-hover transition-all ${
              user.status !== "active" ? "opacity-60" : ""
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {user.username
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{user.username}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
              {user.status === "active" ? (
                <Unlock className="w-5 h-5 text-green-600" />
              ) : (
                <Lock className="w-5 h-5 text-red-600" />
              )}
            </div>

            <div className="mb-4">
              <span
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${getRoleBadgeColor(
                  user.role
                )}`}
              >
                <Shield className="w-3 h-3 mr-1" />
                {getRoleLabel(user.role)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-xs text-gray-600">Created</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatTimestamp(user.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Last Login</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatTimestamp(user.lastLogin)}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 bg-indigo-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center">
                <Edit2 className="w-4 h-4 mr-1" />
                Edit
              </button>
              <button
                disabled
                className="px-4 py-2 rounded-lg font-medium bg-gray-300 text-gray-600 cursor-not-allowed"
                title="Status toggle will be connected after backend user management is implemented."
              >
                {user.status === "active" ? (
                  <Lock className="w-4 h-4" />
                ) : (
                  <Unlock className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 card-shadow-hover">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Add New User</h2>
            <p className="text-sm text-gray-600 mb-6">
              User provisioning will be connected to the backend admin flow next.
            </p>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-3 rounded-lg border border-gray-300"
                disabled
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300"
                disabled
              />
              <select
                className="w-full px-4 py-3 rounded-lg border border-gray-300"
                disabled
              >
                <option value="operator">Operator</option>
                <option value="admin">Admin</option>
                <option value="super-admin">Super Admin</option>
              </select>
              <input
                type="password"
                placeholder="Temporary Password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300"
                disabled
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                disabled
                className="flex-1 bg-gray-300 text-gray-600 font-semibold px-6 py-3 rounded-lg cursor-not-allowed"
              >
                Create User
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;