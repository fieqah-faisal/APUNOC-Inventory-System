import React, { useState } from "react";
import firebase from "../firebase";

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e:any) => {
    e.preventDefault();

    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
    } catch (error:any) {
      alert(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">

      <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-lg">

        <h2 className="text-xl font-bold mb-4">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-3"
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-3"
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button className="bg-blue-500 text-white px-4 py-2 w-full">
          Login
        </button>

      </form>

    </div>
  );
};

export default Login;