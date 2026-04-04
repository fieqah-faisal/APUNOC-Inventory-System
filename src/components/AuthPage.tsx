import React from "react";
import Login from "./Login";
import { loginWithEmail } from "../services/authService";
import { useAuth } from "../hooks/useAuth";

const AuthPage: React.FC = () => {
  const { authError } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    await loginWithEmail(email, password);
  };

  return <Login onLogin={handleLogin} authError={authError} />;
};

export default AuthPage;