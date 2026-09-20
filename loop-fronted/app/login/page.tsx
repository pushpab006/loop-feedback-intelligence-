"use client";

import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed.");
        return;
      }

      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "loopUser",
        JSON.stringify(data.user)
      );

      window.location.href = "/";
    } catch (error) {
      console.error("Login error:", error);

      setMessage(
        "Cannot connect to server. Make sure backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-500">
            LOOP
          </h1>

          <p className="text-slate-400 mt-2">
            Customer Feedback Intelligence
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

          <h2 className="text-2xl font-bold mb-2">
            Welcome back
          </h2>

          <p className="text-slate-400 mb-6">
            Sign in to your LOOP workspace.
          </p>

          <form onSubmit={handleLogin}>

            <label className="block text-sm text-slate-300 mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 mb-5 outline-none focus:border-blue-500"
            />

            <label className="block text-sm text-slate-300 mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 py-3 rounded-lg font-semibold"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

          </form>

          {message && (
            <p className="text-red-400 text-sm mt-4">
              {message}
            </p>
          )}

          <p className="text-slate-500 text-xs text-center mt-6">
            LOOP Feedback Intelligence Platform
          </p>

        </div>
      </div>
    </main>
  );
}