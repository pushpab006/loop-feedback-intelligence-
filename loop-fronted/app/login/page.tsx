"use client";

import { useState } from "react";

const API_URL = "https://loop-feedback-intelligence.onrender.com";

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);

  const [name, setName] = useState("");
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
        `${API_URL}/api/auth/login`,
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

      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Login error:", error);

      setMessage(
        "Cannot connect to server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Registration failed.");
        return;
      }

      setMessage(
        "Account created successfully. You can now sign in."
      );

      setName("");
      setPassword("");
      setIsSignup(false);
    } catch (error) {
      console.error("Signup error:", error);

      setMessage(
        "Cannot connect to server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
      <div className="w-full max-w-md">

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-blue-500">
            LOOP
          </h1>

          <p className="mt-2 text-slate-400">
            Customer Feedback Intelligence
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">

          <h2 className="mb-2 text-2xl font-bold">
            {isSignup ? "Create your account" : "Welcome back"}
          </h2>

          <p className="mb-6 text-slate-400">
            {isSignup
              ? "Create an account to access your LOOP workspace."
              : "Sign in to your LOOP workspace."}
          </p>

          <form
            onSubmit={
              isSignup ? handleSignup : handleLogin
            }
          >

            {isSignup && (
              <>
                <label className="mb-2 block text-sm text-slate-300">
                  Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="mb-5 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-blue-500"
                />
              </>
            )}

            <label className="mb-2 block text-sm text-slate-300">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mb-5 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-blue-500"
            />

            <label className="mb-2 block text-sm text-slate-300">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-blue-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-lg bg-blue-600 py-3 font-semibold hover:bg-blue-700 disabled:bg-blue-800"
            >
              {loading
                ? isSignup
                  ? "Creating Account..."
                  : "Signing In..."
                : isSignup
                ? "Create Account"
                : "Sign In"}
            </button>

          </form>

          {message && (
            <p className="mt-4 text-center text-sm text-red-400">
              {message}
            </p>
          )}

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup);
                setMessage("");
              }}
              className="text-sm font-medium text-blue-400 hover:text-blue-300"
            >
              {isSignup
                ? "Already have an account? Sign In"
                : "Don't have an account? Create Account"}
            </button>
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            LOOP Feedback Intelligence Platform
          </p>

        </div>
      </div>
    </main>
  );
}