import React, { useState } from 'react';
import { Building2, Plus, MapPin, Package, Edit2, Archive } from 'lucide-react';
import { sites as initialSites, categories, assets, currentUser } from '../data/mockData';
import { Site } from '../types';
import { permissions } from '../utils/permissions';

const Sites: React.FC = () => {
  const [sites, setSites] = useState<Site[]>(initialSites);
  const [showAddModal, setShowAddModal] = useState(false);

  const canManageSites = permissions.canManageSites(currentUser.role);

  const getSiteAssets = (siteId: string) => {
    return assets.filter(a => a.siteId === siteId);
  };

  const getSiteCategory = (categoryId: string) => {
    return categories.find(c => c.id === categoryId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Building2 className="w-7 h-7 mr-3 text-emerald-600" />
              Sites & Projects
            </h1>
            <p className="text-sm text-gray-600 mt-1">Manage deployment sites and project locations</p>
          </div>
          {canManageSites && (
            <button
              onClick={() => setShowAddModal(true)}
              className="gradient-success text-white font-semibold px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center justify-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Site
            </button>
          )}
        </div>
      </div>

      {/* Sites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sites.map((site) => {
          const category = getSiteCategory(site.categoryId);
          const siteAssets = getSiteAssets(site.id);
          const deployedCount = siteAssets.filter(a => a.status === 'deployed').length;
          const inStockCount = siteAssets.filter(a => a.status === 'in-stock').length;

          return (
            <div
              key={site.id}
              className="bg-white rounded-xl p-6 card-shadow hover:card-shadow-hover transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                      {category?.name}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{site.name}</h3>
                  {site.description && (
                    <p className="text-sm text-gray-600 mt-1">{site.description}</p>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-xs font-medium text-gray-600 mb-1">Deployed</p>
                  <p className="text-2xl font-bold text-blue-600">{deployedCount}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                  <p className="text-xs font-medium text-gray-600 mb-1">In Stock</p>
                  <p className="text-2xl font-bold text-green-600">{inStockCount}</p>
                </div>
              </div>

              {/* Assets List */}
              {siteAssets.length > 0 && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 uppercase mb-2 flex items-center">
                    <Package className="w-3 h-3 mr-1" />
                    Recent Assets
                  </p>
                  <div className="space-y-1">
                    {siteAssets.slice(0, 3).map(asset => (
                      <div key={asset.id} className="text-xs text-gray-700">
                        • {asset.brand} {asset.model}
                      </div>
                    ))}
                    {siteAssets.length > 3 && (
                      <div className="text-xs text-indigo-600 font-semibold">
                        +{siteAssets.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Meta Info */}
              <div className="text-xs text-gray-500 mb-4 pb-4 border-b border-gray-200">
                <p>Created by {site.createdBy}</p>
                <p>{site.createdAt.toLocaleDateString()}</p>
              </div>

              {/* Actions */}
              {canManageSites && (
                <div className="flex gap-2">
                  <button className="flex-1 bg-indigo-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center">
                    <Edit2 className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button className="bg-gray-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                    <Archive className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Site Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 card-shadow-hover">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Site</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Site Name</label>
                <input
                  type="text"
                  placeholder="e.g., Bloomsvale"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  placeholder="Brief description of the site..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 gradient-success text-white font-semibold px-6 py-3 rounded-lg hover:shadow-lg transition-all"
              >
                Create Site
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

export default Sites;
