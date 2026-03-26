import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, MapPin, Package, Filter } from 'lucide-react';
import { Asset, AssetStatus } from '../types';
import { assets as initialAssets, categories, locations } from '../data/mockData';

const Assets: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState<AssetStatus | 'all'>('all');

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = 
      asset.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.barcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || asset.categoryId === filterCategory;
    const matchesStatus = filterStatus === 'all' || asset.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: AssetStatus) => {
    const colors = {
      'in-stock': 'bg-green-100 text-green-800 border-green-200',
      'deployed': 'bg-blue-100 text-blue-800 border-blue-200',
      'under-repair': 'bg-red-100 text-red-800 border-red-200',
      'replacement': 'bg-amber-100 text-amber-800 border-amber-200',
      'retired': 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[status];
  };

  const getStatusLabel = (status: AssetStatus) => {
    return status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Package className="w-7 h-7 mr-3 text-indigo-600" />
              Asset Management
            </h1>
            <p className="text-sm text-gray-600 mt-1">Manage and track all network assets</p>
          </div>
          <button className="gradient-primary text-white font-semibold px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center justify-center">
            <Plus className="w-5 h-5 mr-2" />
            Add New Asset
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as AssetStatus | 'all')}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="in-stock">In Stock</option>
            <option value="deployed">Deployed</option>
            <option value="under-repair">Under Repair</option>
            <option value="replacement">Replacement</option>
            <option value="retired">Retired</option>
          </select>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssets.map((asset) => {
          const category = categories.find(c => c.id === asset.categoryId);
          const location = locations.find(l => l.id === asset.locationId);
          
          return (
            <div
              key={asset.id}
              className="bg-white rounded-xl p-6 card-shadow hover:card-shadow-hover transition-all"
            >
              {/* Category Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
                  {category?.name}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(asset.status)}`}>
                  {getStatusLabel(asset.status)}
                </span>
              </div>

              {/* Asset Info */}
              <h3 className="text-lg font-bold text-gray-900 mb-3">{asset.brand} {asset.model}</h3>
              
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Asset ID:</span>
                  <span className="font-semibold text-gray-900">{asset.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Barcode:</span>
                  <span className="font-mono text-xs text-gray-900">{asset.barcode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Serial:</span>
                  <span className="font-mono text-xs text-gray-900">{asset.serialNumber}</span>
                </div>
              </div>

              {/* Location */}
              {location && (
                <div className="flex items-start text-sm mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">{location.building}</p>
                    <p className="text-gray-600">{location.floor} - {location.room}</p>
                    {location.rack && <p className="text-gray-600">{location.rack}</p>}
                  </div>
                </div>
              )}

              {/* Notes */}
              {asset.notes && (
                <p className="text-sm text-gray-600 mb-4 italic bg-amber-50 p-2 rounded border border-amber-200">
                  {asset.notes}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button className="flex-1 bg-indigo-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center">
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit
                </button>
                <button className="bg-red-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAssets.length === 0 && (
        <div className="bg-white rounded-xl p-12 card-shadow text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-semibold text-gray-900">No assets found</p>
          <p className="text-gray-600 mt-2">Try adjusting your filters or add a new asset</p>
        </div>
      )}
    </div>
  );
};

export default Assets;
