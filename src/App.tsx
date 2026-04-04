import React, { useState } from "react";
import { useAuth } from "./hooks/useAuth";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Assets from "./pages/Assets";
import Consumables from "./pages/Consumables";
import Sites from "./pages/Sites";
import Locations from "./pages/Locations";
import Scanner from "./pages/Scanner";
import Import from "./pages/Import";
import MovementLogs from "./pages/MovementLogs";
import UserManagement from "./pages/UserManagement";
import AuditLogs from "./pages/AuditLogs";
import AuthPage from "./components/AuthPage";
import AccessDenied from "./components/AccessDenied";
import {
  canImportInventory,
  canManageUsers,
  canViewAuditLogs,
} from "./permissions/permissions";

function App() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState("dashboard");

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard />;
      case "assets":
        return <Assets />;
      case "consumables":
        return <Consumables />;
      case "sites":
        return <Sites />;
      case "locations":
        return <Locations />;
      case "scan":
        return <Scanner />;
      case "import":
        return canImportInventory(user) ? <Import /> : <AccessDenied />;
      case "logs":
        return <MovementLogs />;
      case "users":
        return canManageUsers(user) ? <UserManagement /> : <AccessDenied />;
      case "audit":
        return canViewAuditLogs(user) ? <AuditLogs /> : <AccessDenied />;
      default:
        return <Dashboard />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
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