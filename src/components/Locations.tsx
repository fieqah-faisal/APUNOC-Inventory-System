import React from 'react';
import { MapPin, Building2, Layers, DoorOpen } from 'lucide-react';
import { locations, assets, categories } from '../data/mockData';

const Locations: React.FC = () => {
  const getAssetsAtLocation = (locationId: string) => {
    return assets.filter(asset => asset.locationId === locationId);
  };

  const groupedLocations = locations.reduce((acc, location) => {
    if (!acc[location.building]) {
      acc[location.building] = [];
    }
    acc[location.building].push(location);
    return acc;
  }, {} as Record<string, typeof locations>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <MapPin className="w-7 h-7 mr-3 text-purple-600" />
          Location Management
        </h1>
        <p className="text-sm text-gray-600 mt-1">Track where your assets are deployed</p>
      </div>

      {/* Buildings */}
      {Object.entries(groupedLocations).map(([building, locs]) => (
        <div 
          key={building}
          className="bg-white rounded-xl p-6 card-shadow"
        >
          <div className="flex items-center mb-6 pb-4 border-b border-gray-200">
            <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 mr-4">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{building}</h2>
              <p className="text-sm text-gray-600">{locs.length} locations</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {locs.map((location) => {
              const locationAssets = getAssetsAtLocation(location.id);
              
              return (
                <div
                  key={location.id}
                  className="p-5 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <Layers className="w-5 h-5 mr-2 text-gray-600" />
                      <span className="font-semibold text-gray-900">{location.floor}</span>
                    </div>
                    <div className="bg-indigo-600 text-white px-3 py-1 rounded-full">
                      <span className="font-bold text-sm">{locationAssets.length}</span>
                    </div>
                  </div>

                  <div className="flex items-center mb-4">
                    <DoorOpen className="w-5 h-5 mr-2 text-gray-600" />
                    <span className="font-bold text-gray-900 text-lg">{location.room}</span>
                  </div>

                  {location.rack && (
                    <div className="bg-gray-200 px-3 py-1.5 rounded-lg mb-3 inline-block">
                      <span className="font-medium text-gray-700 text-sm">{location.rack}</span>
                    </div>
                  )}

                  {locationAssets.length > 0 && (
                    <div className="space-y-2 mt-4 pt-4 border-t border-gray-300">
                      <p className="font-semibold text-gray-700 text-xs uppercase tracking-wide">Deployed Assets:</p>
                      {locationAssets.map(asset => {
                        const category = categories.find(c => c.id === asset.categoryId);
                        return (
                          <div 
                            key={asset.id}
                            className="bg-white p-3 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors"
                          >
                            <p className="font-semibold text-gray-900 text-sm">{asset.brand} {asset.model}</p>
                            <p className="text-xs text-gray-600">{category?.name}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Locations;
