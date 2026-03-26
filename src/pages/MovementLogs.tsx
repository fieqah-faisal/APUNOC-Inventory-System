import React from 'react';
import { History, ArrowRight, User, Calendar } from 'lucide-react';
import { movementLogs, assets, locations } from '../data/mockData';

const MovementLogs: React.FC = () => {
  const sortedLogs = [...movementLogs].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'in-stock': 'bg-green-100 text-green-800 border-green-200',
      'deployed': 'bg-blue-100 text-blue-800 border-blue-200',
      'under-repair': 'bg-red-100 text-red-800 border-red-200',
      'replacement': 'bg-amber-100 text-amber-800 border-amber-200',
      'retired': 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <History className="w-7 h-7 mr-3 text-blue-600" />
          Movement Logs
        </h1>
        <p className="text-sm text-gray-600 mt-1">Track all asset status changes and movements</p>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {sortedLogs.map((log) => {
          const asset = assets.find(a => a.id === log.assetId);
          const oldLocation = locations.find(l => l.id === log.oldLocationId);
          const newLocation = locations.find(l => l.id === log.newLocationId);
          
          return (
            <div 
              key={log.id}
              className="bg-white rounded-xl p-6 card-shadow hover:card-shadow-hover transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Asset Info */}
                <div className="flex-1">
                  <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-indigo-100 text-indigo-800 font-semibold text-sm mb-3">
                    {asset?.brand} {asset?.model}
                  </div>
                  
                  <div className="flex items-center gap-4 mb-3">
                    <div className={`px-4 py-2 rounded-lg border font-semibold text-sm ${log.oldStatus ? getStatusColor(log.oldStatus) : 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                      {log.oldStatus?.toUpperCase() || 'NEW'}
                    </div>
                    
                    <ArrowRight className="w-6 h-6 text-gray-400" />
                    
                    <div className={`px-4 py-2 rounded-lg border font-semibold text-sm ${getStatusColor(log.newStatus)}`}>
                      {log.newStatus.toUpperCase()}
                    </div>
                  </div>

                  {(oldLocation || newLocation) && (
                    <div className="flex items-center gap-4 text-sm">
                      {oldLocation && (
                        <div className="bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                          <span className="text-gray-600">From: </span>
                          <span className="font-semibold text-gray-900">{oldLocation.room}</span>
                        </div>
                      )}
                      {newLocation && (
                        <div className="bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                          <span className="text-gray-600">To: </span>
                          <span className="font-semibold text-gray-900">{newLocation.room}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {log.notes && (
                    <p className="mt-3 text-sm text-gray-600 italic bg-blue-50 p-3 rounded-lg border border-blue-200">
                      {log.notes}
                    </p>
                  )}
                </div>

                {/* Meta Info */}
                <div className="lg:text-right space-y-2 lg:min-w-[180px]">
                  <div className="flex items-center lg:justify-end gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold text-gray-900">{log.updatedBy}</span>
                  </div>
                  <div className="flex items-center lg:justify-end gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {log.timestamp.toLocaleDateString()} {log.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MovementLogs;
