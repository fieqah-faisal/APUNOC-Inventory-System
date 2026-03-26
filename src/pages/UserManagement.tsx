import React, { useState } from 'react';
import { Users, Plus, Edit2, Lock, Unlock, Shield } from 'lucide-react';
import { users as initialUsers } from '../data/mockData';
import { User, UserRole } from '../types';
import { getRoleBadgeColor, getRoleLabel } from '../utils/permissions';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [showAddModal, setShowAddModal] = useState(false);

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Users className="w-7 h-7 mr-3 text-purple-600" />
              User Management
            </h1>
            <p className="text-sm text-gray-600 mt-1">Manage user accounts and permissions</p>
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

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            className={`bg-white rounded-xl p-6 card-shadow hover:card-shadow-hover transition-all ${
              !user.isActive ? 'opacity-60' : ''
            }`}
          >
            {/* User Info */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
              {user.isActive ? (
                <Unlock className="w-5 h-5 text-green-600" />
              ) : (
                <Lock className="w-5 h-5 text-red-600" />
              )}
            </div>

            {/* Role Badge */}
            <div className="mb-4">
              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${getRoleBadgeColor(user.role)}`}>
                <Shield className="w-3 h-3 mr-1" />
                {getRoleLabel(user.role)}
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-xs text-gray-600">Created</p>
                <p className="text-sm font-semibold text-gray-900">
                  {user.createdAt.toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Last Login</p>
                <p className="text-sm font-semibold text-gray-900">
                  {user.lastLogin ? user.lastLogin.toLocaleDateString() : 'Never'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button className="flex-1 bg-indigo-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center">
                <Edit2 className="w-4 h-4 mr-1" />
                Edit
              </button>
              <button
                onClick={() => toggleUserStatus(user.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  user.isActive
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {user.isActive ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 card-shadow-hover">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New User</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  placeholder="john.doe@noc.com"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="operator">Operator</option>
                  <option value="admin">Admin</option>
                  <option value="super-admin">Super Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 gradient-primary text-white font-semibold px-6 py-3 rounded-lg hover:shadow-lg transition-all"
              >
                Create User
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
