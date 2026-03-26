import React from 'react';
import { FileText, User, Calendar, Activity } from 'lucide-react';
import { auditLogs } from '../data/mockData';

const AuditLogs: React.FC = () => {
  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      'CREATE': 'bg-green-100 text-green-800 border-green-200',
      'UPDATE': 'bg-blue-100 text-blue-800 border-blue-200',
      'DELETE': 'bg-red-100 text-red-800 border-red-200',
      'IMPORT': 'bg-purple-100 text-purple-800 border-purple-200',
    };
    return colors[action] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <FileText className="w-7 h-7 mr-3 text-indigo-600" />
          Audit Logs
        </h1>
        <p className="text-sm text-gray-600 mt-1">System-wide activity and change tracking</p>
      </div>

      {/* Logs Timeline */}
      <div className="space-y-4">
        {auditLogs.map((log) => (
          <div
            key={log.id}
            className="bg-white rounded-xl p-6 card-shadow hover:card-shadow-hover transition-all"
          >
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Action Badge */}
              <div className={`inline-flex items-center px-4 py-2 rounded-lg border font-semibold text-sm ${getActionColor(log.action)}`}>
                <Activity className="w-4 h-4 mr-2" />
                {log.action}
              </div>

              {/* Details */}
              <div className="flex-1">
                <p className="font-semibold text-gray-900 mb-1">{log.details}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {log.userName}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {log.timestamp.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Entity Type */}
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
                <p className="text-xs font-semibold text-gray-600 uppercase">{log.entityType}</p>
                {log.entityId && (
                  <p className="text-xs text-gray-500 font-mono">{log.entityId}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuditLogs;
