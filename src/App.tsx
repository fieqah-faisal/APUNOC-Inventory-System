import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Assets from './components/Assets';
import Consumables from './components/Consumables';
import Sites from './components/Sites';
import Locations from './components/Locations';
import Scanner from './components/Scanner';
import Import from './components/Import';
import MovementLogs from './components/MovementLogs';
import UserManagement from './components/UserManagement';
import AuditLogs from './components/AuditLogs';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'assets':
        return <Assets />;
      case 'consumables':
        return <Consumables />;
      case 'sites':
        return <Sites />;
      case 'locations':
        return <Locations />;
      case 'scan':
        return <Scanner />;
      case 'import':
        return <Import />;
      case 'logs':
        return <MovementLogs />;
      case 'users':
        return <UserManagement />;
      case 'audit':
        return <AuditLogs />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      {renderView()}
    </Layout>
  );
}

export default App;
