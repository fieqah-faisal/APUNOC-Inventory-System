import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import { loginWithEmail, registerWithEmail } from "../services/authService";
import { createUserProfile } from "../services/userService";

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<"login" | "register">("login");

  const handleLogin = async (email: string, password: string) => {
    await loginWithEmail(email, password);
  };

  const handleRegister = async (
    username: string,
    email: string,
    password: string
  ) => {
    const userCredential = await registerWithEmail(email, password);

    await createUserProfile({
      uid: userCredential.user.uid,
      username,
      email,
      role: "operator",
    });

    setMode("login");
  };

  return mode === "login" ? (
    <Login
      onLogin={handleLogin}
      onSwitchToRegister={() => setMode("register")}
    />
  ) : (
    <Register
      onRegister={handleRegister}
      onSwitchToLogin={() => setMode("login")}
    />
  );
};

export default AuthPage;