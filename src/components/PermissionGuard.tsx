import React from "react";
import { useAuth } from "../hooks/useAuth";

interface PermissionGuardProps {
  allowed: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({
  allowed,
  fallback = null,
  children,
}) => {
  return <>{allowed ? children : fallback}</>;
};

export default PermissionGuard;