import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { AlertTriangle, TrendingUp, Package, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { assets, items, categories, movementLogs } from '../data/mockData';

const Dashboard: React.FC = () => {
  const statusCounts = {
    'in-stock': assets.filter(a => a.status === 'in-stock').length,
    'deployed': assets.filter(a => a.status === 'deployed').length,
    'under-repair': assets.filter(a => a.status === 'under-repair').length,
    'replacement': assets.filter(a => a.status === 'replacement').length,
    'retired': assets.filter(a => a.status === 'retired').length,
  };

  const pieData = [
    { name: 'In Stock', value: statusCounts['in-stock'], color: '#10b981' },
    { name: 'Deployed', value: statusCounts['deployed'], color: '#6366f1' },
    { name: 'Under Repair', value: statusCounts['under-repair'], color: '#ef4444' },
    { name: 'Replacement', value: statusCounts['replacement'], color: '#f59e0b' },
    { name: 'Retired', value: statusCounts['retired'], color: '#6b7280' },
  ];

  const categoryData = categories.map(cat => ({
    name: cat.name,
    count: assets.filter(a => a.categoryId === cat.id).length,
  }));

  const lowStockItems = items.filter(item => item.quantity <= item.minThreshold);
  const recentLogs = [...movementLogs].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 5);

  const StatCard = ({ title, value, icon: Icon, gradient, trend, trendValue }: any) => (
    <div className="bg-white rounded-xl p-6 card-shadow hover:card-shadow-hover transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${gradient}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 text-sm font-semibold ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Assets" 
          value={assets.length} 
          icon={Package}
          gradient="gradient-primary"
          trend="up"
          trendValue="12%"
        />
        <StatCard 
          title="Deployed" 
          value={statusCounts.deployed} 
          icon={TrendingUp}
          gradient="gradient-success"
          trend="up"
          trendValue="8%"
        />
        <StatCard 
          title="In Stock" 
          value={statusCounts['in-stock']} 
          icon={Activity}
          gradient="bg-gradient-to-br from-blue-500 to-cyan-600"
        />
        <StatCard 
          title="Low Stock Items" 
          value={lowStockItems.length} 
          icon={AlertTriangle}
          gradient="gradient-warning"
          trend="down"
          trendValue="3%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white rounded-xl p-6 card-shadow">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Asset Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-xl p-6 card-shadow">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Assets by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alert */}
        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-gray-900">Low Stock Alerts</h2>
          </div>
          <div className="space-y-3">
            {lowStockItems.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Package className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-sm font-medium text-gray-600">All items are well stocked!</p>
              </div>
            ) : (
              lowStockItems.map(item => {
                const category = categories.find(c => c.id === item.categoryId);
                return (
                  <div 
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">{category?.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-amber-600">{item.quantity}</p>
                      <p className="text-xs text-gray-500">Min: {item.minThreshold}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 card-shadow">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentLogs.map((log) => {
              const asset = assets.find(a => a.id === log.assetId);
              return (
                <div 
                  key={log.id}
                  className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {asset?.brand} {asset?.model}
                    </p>
                    <p className="text-xs text-gray-600">
                      {log.oldStatus} → {log.newStatus}
                    </p>
                    {log.notes && (
                      <p className="text-xs text-gray-500 mt-1 italic">{log.notes}</p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-medium text-gray-600">{log.updatedBy}</p>
                    <p className="text-xs text-gray-400">
                      {log.timestamp.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
