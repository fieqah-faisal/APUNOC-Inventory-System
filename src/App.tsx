import React, {useState} from "react";
import {useAuth} from "./hooks/useAuth";
import Login from "./components/Login";
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Assets from './pages/Assets';
import Consumables from './pages/Consumables';
import Sites from './pages/Sites';
import Locations from './pages/Locations';
import Scanner from './pages/Scanner';
import Import from './pages/Import';
import MovementLogs from './pages/MovementLogs';
import UserManagement from './pages/UserManagement';
import AuditLogs from './pages/AuditLogs';
import AuthPage from "./components/AuthPage";

function App() {
  const {user, loading} = useAuth();
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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  if (!user) {
    return <AuthPage />;
  }

  return (
    <Layout user={user} currentView={currentView} onViewChange={setCurrentView}>
      {renderView()}
    </Layout>
  );
}

export default App;
