import React, { useEffect, useState } from 'react';
import firebase from "./firebase";
import Login from "./components/Login";
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
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

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
    return <div>Loading...</div>;
  }
  if (!user) {
    return <Login />;
  }

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      {renderView()}
    </Layout>
  );
}

export default App;
