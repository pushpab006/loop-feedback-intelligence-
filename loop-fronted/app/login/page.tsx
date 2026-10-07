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

  const [showPassword, setShowPassword] = useState(false);

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
    <main className="min-h-screen bg-slate-50 text-slate-900"><div className="grid min-h-screen lg:grid-cols-2">

        {/* Left Branding Section */}
        <section className="hidden bg-gradient-to-br from-violet-700 via-purple-700 to-indigo-800 p-12 text-white lg:flex lg:flex-col lg:justify-between">

          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 7.5C7 5.567 8.567 4 10.5 4H17C18.657 4 20 5.343 20 7V13.5C20 15.433 18.433 17 16.5 17H14L10 20V17H7.5C5.567 17 4 15.433 4 13.5V10"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 8H15"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M8 12H12"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <span className="text-2xl font-bold tracking-tight">
                LOOP
              </span>
            </div>

            <div className="mt-20 max-w-lg">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-violet-200">
                Customer Feedback Intelligence
              </p>

              <h1 className="text-4xl font-bold leading-tight xl:text-5xl">
                Turn customer feedback into better decisions.
              </h1>

              <p className="mt-6 text-base leading-7 text-violet-100">
                Collect, understand, and analyze customer feedback
                with intelligent insights that help your team build
                better products.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm text-violet-200">
            <div className="h-2 w-2 rounded-full bg-emerald-300" />
            Intelligent feedback platform
          </div>

        </section>

        {/* Right Login Section */}
        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">

          <div className="w-full max-w-md">

            {/* Mobile Logo */}
            <div className="mb-8 text-center lg:hidden">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 7.5C7 5.567 8.567 4 10.5 4H17C18.657 4 20 5.343 20 7V13.5C20 15.433 18.433 17 16.5 17H14L10 20V17H7.5C5.567 17 4 15.433 4 13.5V10"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 8H15"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M8 12H12"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <h1 className="mt-3 text-2xl font-bold text-slate-900">
                LOOP
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Customer Feedback Intelligence
              </p>
            </div>

            {/* Login Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

              <div className="mb-7">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  {isSignup
                    ? "Create your account"
                    : "Welcome back"}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {isSignup
                    ? "Create an account to access your LOOP workspace."
                    : "Sign in to continue to your LOOP workspace."}
                </p>
              </div><form
                onSubmit={
                  isSignup ? handleSignup : handleLogin
                }
                className="space-y-5"
              >

                {/* Name */}
                {isSignup && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Full Name
                    </label>

                    <div className="relative">
                      <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <svg
                          width="19"
                          height="19"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M20 21C20 17.6863 17.3137 15 14 15H10C6.68629 15 4 17.6863 4 21"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                          />
                          <circle
                            cx="12"
                            cy="7"
                            r="4"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          />
                        </svg>
                      </div>

                      <input
                        type="text"
                        value={name}
                        onChange={(e) =>
                          setName(e.target.value)
                        }
                        placeholder="Enter your full name"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                      />
                    </div>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email Address
                  </label>

                  <div className="relative">
                    <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <svg
                        width="19"
                        height="19"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="3"
                          y="5"
                          width="18"
                          height="14"
                          rx="2"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        />
                        <path
                          d="M4 7L12 13L20 7"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    <input
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Password
                  </label>

                  <div className="relative">
                    <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <svg
                        width="19"
                        height="19"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="4"
                          y="10"
                          width="16"
                          height="11"
                          rx="2"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        />
                        <path
                          d="M8 10V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V10"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      placeholder="Enter your password"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-12 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <svg
                          width="19"
                          height="19"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3 3L21 21"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                          />
                          <path
                            d="M10.58 10.58C10.21 10.95 10 11.46 10 12C10 13.1 10.9 14 12 14C12.54 14 13.05 13.79 13.42 13.42"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                          />
                          <path
                            d="M9.88 5.09C10.57 4.87 11.28 4.75 12 4.75C17.2 4.75 20.5 9.5 21.5 12C21.04 13.16 20.08 14.79 18.5 16.2"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                          />
                          <path
                            d="M6.61 6.61C4.72 8.05 3.39 10.27 2.5 12C3.5 14.5 6.8 19.25 12 19.25C13.55 19.25 14.98 18.82 16.25 18.12"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="19"
                          height="19"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M2.5 12C3.5 9.5 6.8 4.75 12 4.75C17.2 4.75 20.5 9.5 21.5 12C20.5 14.5 17.2 19.25 12 19.25C6.8 19.25 3.5 14.5 2.5 12Z"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          />
                          <circle
                            cx="12"
                            cy="12"
                            r="3"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>{/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-violet-400"
                >
                  {loading ? (
                    <>
                      <svg
                        className="h-5 w-5 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="opacity-30"
                        />

                        <path
                          d="M21 12a9 9 0 0 0-9-9"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>

                      {isSignup
                        ? "Creating Account..."
                        : "Signing In..."}
                    </>
                  ) : (
                    <>
                      {isSignup
                        ? "Create Account"
                        : "Sign In"}

                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5 12H19"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />

                        <path
                          d="M13 6L19 12L13 18"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </>
                  )}
                </button>

              </form>

              {/* Message */}
              {message && (
                <div
                  className={`mt-5 rounded-xl border px-4 py-3 text-center text-sm ${
                    message.includes("successfully")
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-red-200 bg-red-50 text-red-600"
                  }`}
                >
                  {message}
                </div>
              )}

              {/* Account Switch */}
              <div className="mt-6 border-t border-slate-100 pt-6 text-center">
                <p className="text-sm text-slate-500">
                  {isSignup
                    ? "Already have an account?"
                    : "Don't have an account?"}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setIsSignup(!isSignup);
                    setMessage("");
                  }}
                  className="mt-1 text-sm font-semibold text-violet-600 transition hover:text-violet-700"
                >
                  {isSignup
                    ? "Sign In"
                    : "Create Account"}
                </button>
              </div>

            </div>

            {/* Footer */}
            <p className="mt-6 text-center text-xs text-slate-400">
              LOOP Feedback Intelligence Platform
            </p>

          </div>

        </section>

      </div>
    </main>
  );
}