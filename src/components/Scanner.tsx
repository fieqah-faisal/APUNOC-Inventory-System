import React, { useState } from 'react';
import { ScanBarcode, Search, CheckCircle, XCircle } from 'lucide-react';
import { assets, locations, categories } from '../data/mockData';
import { AssetStatus } from '../types';

const Scanner: React.FC = () => {
  const [barcodeInput, setBarcodeInput] = useState('');
  const [scannedAsset, setScannedAsset] = useState<typeof assets[0] | null>(null);
  const [newStatus, setNewStatus] = useState<AssetStatus>('in-stock');
  const [newLocationId, setNewLocationId] = useState('');
  const [notes, setNotes] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleScan = () => {
    const asset = assets.find(a => a.barcode === barcodeInput);
    if (asset) {
      setScannedAsset(asset);
      setNewStatus(asset.status);
      setNewLocationId(asset.locationId || '');
      setNotes('');
      setShowSuccess(false);
    } else {
      setScannedAsset(null);
    }
  };

  const handleUpdate = () => {
    if (scannedAsset) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setBarcodeInput('');
        setScannedAsset(null);
      }, 2000);
    }
  };

  const getStatusColor = (status: AssetStatus) => {
    const colors = {
      'in-stock': 'bg-green-100 text-green-800',
      'deployed': 'bg-blue-100 text-blue-800',
      'under-repair': 'bg-red-100 text-red-800',
      'replacement': 'bg-amber-100 text-amber-800',
      'retired': 'bg-gray-100 text-gray-800',
    };
    return colors[status];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <ScanBarcode className="w-7 h-7 mr-3 text-cyan-600" />
          Barcode Scanner
        </h1>
        <p className="text-sm text-gray-600 mt-1">Scan or enter barcode to update asset status</p>
      </div>

      {/* Scanner Input */}
      <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-8 rounded-xl border border-cyan-200 card-shadow">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Enter or scan barcode..."
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleScan()}
              className="w-full px-6 py-4 rounded-lg border-2 border-gray-300 font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleScan}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold px-8 py-4 rounded-lg hover:shadow-lg transition-all flex items-center"
          >
            <Search className="w-6 h-6 mr-2" />
            Scan
          </button>
        </div>

        {barcodeInput && !scannedAsset && (
          <div className="mt-4 bg-red-100 border border-red-300 p-4 rounded-lg flex items-center">
            <XCircle className="w-6 h-6 mr-3 text-red-600" />
            <span className="font-semibold text-red-800">Asset not found! Check the barcode and try again.</span>
          </div>
        )}
      </div>

      {/* Scanned Asset Details */}
      {scannedAsset && (
        <div className="bg-white rounded-xl p-8 card-shadow">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="w-1 h-6 bg-indigo-600 rounded-full mr-3"></div>
            Asset Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200">
                <p className="text-sm font-medium text-gray-600 mb-1">Asset ID</p>
                <p className="text-xl font-bold text-gray-900">{scannedAsset.id}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-gray-600 mb-1">Brand & Model</p>
                <p className="text-xl font-bold text-gray-900">{scannedAsset.brand} {scannedAsset.model}</p>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-600 mb-1">Serial Number</p>
                <p className="text-lg font-mono font-semibold text-gray-900">{scannedAsset.serialNumber}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm font-medium text-gray-600 mb-1">Category</p>
                <p className="text-xl font-bold text-gray-900">
                  {categories.find(c => c.id === scannedAsset.categoryId)?.name}
                </p>
              </div>
              <div className={`p-4 rounded-lg border ${getStatusColor(scannedAsset.status)}`}>
                <p className="text-sm font-medium mb-1">Current Status</p>
                <p className="text-xl font-bold uppercase">{scannedAsset.status}</p>
              </div>
              {scannedAsset.locationId && (
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200">
                  <p className="text-sm font-medium text-gray-600 mb-1">Current Location</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {locations.find(l => l.id === scannedAsset.locationId)?.room}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Update Form */}
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Update Asset</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">New Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as AssetStatus)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="in-stock">In Stock</option>
                  <option value="deployed">Deployed</option>
                  <option value="under-repair">Under Repair</option>
                  <option value="replacement">Replacement</option>
                  <option value="retired">Retired</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                <select
                  value={newLocationId}
                  onChange={(e) => setNewLocationId(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">No Location</option>
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.id}>
                      {loc.building} - {loc.room}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this update..."
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleUpdate}
              className="w-full gradient-success text-white font-semibold px-8 py-4 rounded-lg hover:shadow-lg transition-all flex items-center justify-center"
            >
              <CheckCircle className="w-6 h-6 mr-2" />
              Update Asset
            </button>
          </div>
        </div>
      )}

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-2xl card-shadow-hover transform scale-110">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 text-center">Asset Updated Successfully!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scanner;
