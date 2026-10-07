"use client";

import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  workspaceId: number;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("VIEWER");

  const [message, setMessage] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem("loop-theme");

    if (savedTheme === "light") {
      setDarkMode(false);
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;

    setDarkMode(newMode);

    localStorage.setItem(
      "loop-theme",
      newMode ? "dark" : "light"
    );
  };

  async function loadUsers() {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch(
        "https://loop-feedback-intelligence.onrender.com/api/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("loopUser");

        window.location.href = "/login";
        return;
      }

      if (response.status === 403) {
        setMessage("Access denied. Admin only.");
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to load users");
      }

      const data = await response.json();

      setUsers(Array.isArray(data) ? data : []);

    } catch (error) {
      console.error(error);
      setMessage("Failed to load users");

    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function createUser(e: React.FormEvent) {
    e.preventDefault();

    setMessage("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch(
        "https://loop-feedback-intelligence.onrender.com/api/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            email,
            password,
            role,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Failed to create user"
        );
        return;
      }

      setMessage("User created successfully.");

      setName("");
      setEmail("");
      setPassword("");
      setRole("VIEWER");

      loadUsers();

    } catch (error) {
      console.error(error);
      setMessage("Something went wrong");
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("loopUser");

    window.location.href = "/login";
  }

  return (
    <main
      className={
        darkMode
          ? "min-h-screen bg-slate-950 text-white flex"
          : "min-h-screen bg-slate-50 text-slate-900 flex"
      }
    >{/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex w-64 flex-col border-r p-6 ${
          darkMode
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-slate-200"
        }`}
      >
        {/* Logo */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-purple-500">
            LOOP
          </h1>

          <p
            className={`mt-1 text-xs ${
              darkMode
                ? "text-slate-500"
                : "text-slate-400"
            }`}
          >
            Customer Intelligence
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">

          {/* Dashboard */}
          <a
            href="/dashboard"
            className={`flex items-center gap-3 rounded-xl px-4 py-3 ${
              darkMode
                ? "text-slate-400 hover:bg-slate-800"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>

            Dashboard
          </a>


          {/* Add Feedback */}
          <a
            href="/add-feedback"
            className={`flex items-center gap-3 rounded-xl px-4 py-3 ${
              darkMode
                ? "text-slate-400 hover:bg-slate-800"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>

            Add Feedback
          </a>


          {/* Feedback Inbox */}
          <a
            href="/feedback-inbox"
            className={`flex items-center gap-3 rounded-xl px-4 py-3 ${
              darkMode
                ? "text-slate-400 hover:bg-slate-800"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M4 4h16v16H4z" />
              <path d="M4 14h4l2 3h4l2-3h4" />
            </svg>

            Feedback Inbox
          </a>


          {/* CSV Upload */}
          <a
            href="/csv-upload"
            className={`flex items-center gap-3 rounded-xl px-4 py-3 ${
              darkMode
                ? "text-slate-400 hover:bg-slate-800"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
              <path d="M8 13h8M8 17h8" />
            </svg>

            CSV Upload
          </a>


          {/* Themes & Trends */}
          <a
            href="/themes-trends"
            className={`flex items-center gap-3 rounded-xl px-4 py-3 ${
              darkMode
                ? "text-slate-400 hover:bg-slate-800"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M3 17l6-6 4 4 8-9" />
              <path d="M17 6h4v4" />
            </svg>

            Themes & Trends
          </a>


          {/* Ask LOOP */}
          <a
            href="/ask-loop"
            className={`flex items-center gap-3 rounded-xl px-4 py-3 ${
              darkMode
                ? "text-slate-400 hover:bg-slate-800"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
              <path d="M19 15l.7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7z" />
            </svg>

            Ask LOOP
          </a>


          {/* Reports */}
          <a
            href="/reports"
            className={`flex items-center gap-3 rounded-xl px-4 py-3 ${
              darkMode
                ? "text-slate-400 hover:bg-slate-800"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M6 2h9l5 5v15H6z" />
              <path d="M14 2v6h6" />
              <path d="M9 13h6M9 17h6" />
            </svg>

            Reports
          </a>


          {/* User Management */}
          <a
            href="/users"
            className="flex items-center gap-3 rounded-xl bg-purple-600 px-4 py-3 font-medium text-white"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>

            User Management
          </a>

        </nav>


        {/* Bottom Actions */}
        <div
          className={`space-y-2 border-t pt-5 ${
            darkMode
              ? "border-slate-800"
              : "border-slate-200"
          }`}
        >

          {/* Theme */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left ${
              darkMode
                ? "text-slate-300 hover:bg-slate-800"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              {darkMode ? (
                <>
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
                </>
              ) : (
                <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.5 6.5 0 0 0 21 12.8z" />
              )}
            </svg>

            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>


          {/* Logout */}
          <button
            type="button"
            onClick={logout}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left ${
              darkMode
                ? "text-red-400 hover:bg-red-500/10"
                : "text-red-600 hover:bg-red-50"
            }`}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path d="M16 17l5-5-5-5" />
              <path d="M21 12H9" />
            </svg>

            Logout
          </button>

        </div>
      </aside>


      {/* Mobile Header */}
      <div
        className={`fixed left-0 right-0 top-0 z-20 flex items-center justify-between border-b px-5 py-4 md:hidden ${
          darkMode
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-slate-200"
        }`}
      >

        <div>
          <h1 className="text-2xl font-bold text-purple-500">
            LOOP
          </h1>

          <p
            className={`text-xs ${
              darkMode
                ? "text-slate-500"
                : "text-slate-400"
            }`}
          >
            Customer Intelligence
          </p>
        </div>

        <div className="flex items-center gap-2">

          <button
            type="button"
            onClick={toggleTheme}
            className={`rounded-lg p-2 ${
              darkMode
                ? "bg-slate-800 text-slate-200"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              {darkMode ? (
                <>
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
                </>
              ) : (
                <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.5 6.5 0 0 0 21 12.8z" />
              )}
            </svg>
          </button>

          <button
            type="button"
            onClick={logout}
            className="rounded-lg bg-red-500/10 p-2 text-red-500"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path d="M16 17l5-5-5-5" />
              <path d="M21 12H9" />
            </svg>
          </button>

        </div>

      </div>


      {/* Main Content */}
      <section className="min-w-0 flex-1">

        <div className="mx-auto max-w-6xl px-5 py-8 pt-24 md:px-8 md:py-10 md:pt-10">{/* Page Header */}
          <div className="mb-8">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="text-3xl font-bold">
                  User Management
                </h2>

                <p
                  className={`mt-2 ${
                    darkMode
                      ? "text-slate-400"
                      : "text-slate-500"
                  }`}
                >
                  Manage users and access levels in your workspace.
                </p>
              </div>

              <div
                className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${
                  darkMode
                    ? "bg-purple-500/10 text-purple-300"
                    : "bg-purple-50 text-purple-700"
                }`}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M16 11h6M19 8v6" />
                </svg>

                Admin Control
              </div>

            </div>

          </div>


          {/* Overview Cards */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {/* Total Users */}
            <div
              className={`rounded-2xl border p-5 ${
                darkMode
                  ? "bg-slate-900 border-slate-800"
                  : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between">

                <div>
                  <p
                    className={`text-sm ${
                      darkMode
                        ? "text-slate-400"
                        : "text-slate-500"
                    }`}
                  >
                    Total Users
                  </p>

                  <p className="mt-2 text-3xl font-bold">
                    {users.length}
                  </p>
                </div>

                <div className="rounded-xl bg-purple-500/10 p-3 text-purple-500">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  </svg>
                </div>

              </div>
            </div>


            {/* Admins */}
            <div
              className={`rounded-2xl border p-5 ${
                darkMode
                  ? "bg-slate-900 border-slate-800"
                  : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between">

                <div>
                  <p
                    className={`text-sm ${
                      darkMode
                        ? "text-slate-400"
                        : "text-slate-500"
                    }`}
                  >
                    Administrators
                  </p>

                  <p className="mt-2 text-3xl font-bold">
                    {
                      users.filter(
                        (user) => user.role === "ADMIN"
                      ).length
                    }
                  </p>
                </div>

                <div className="rounded-xl bg-blue-500/10 p-3 text-blue-500">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                </div>

              </div>
            </div>


            {/* Viewers */}
            <div
              className={`rounded-2xl border p-5 ${
                darkMode
                  ? "bg-slate-900 border-slate-800"
                  : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between">

                <div>
                  <p
                    className={`text-sm ${
                      darkMode
                        ? "text-slate-400"
                        : "text-slate-500"
                    }`}
                  >
                    Viewers
                  </p>

                  <p className="mt-2 text-3xl font-bold">
                    {
                      users.filter(
                        (user) => user.role === "VIEWER"
                      ).length
                    }
                  </p>
                </div>

                <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-500">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>

              </div>
            </div>

          </div>


          {/* Create User */}
          <section
            className={`mb-8 rounded-2xl border p-5 sm:p-7 ${
              darkMode
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-slate-200 shadow-sm"
            }`}
          >

            <div className="mb-6 flex items-center gap-3">

              <div className="rounded-xl bg-purple-500/10 p-3 text-purple-500">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M19 8v6M16 11h6" />
                </svg>
              </div>

              <div>
                <h3 className="text-xl font-semibold">
                  Create New User
                </h3>

                <p
                  className={`mt-1 text-sm ${
                    darkMode
                      ? "text-slate-400"
                      : "text-slate-500"
                  }`}
                >
                  Add a new member to your workspace.
                </p>
              </div>

            </div>


            <form
              onSubmit={createUser}
              className="grid gap-5 md:grid-cols-2"
            >

              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full rounded-xl border px-4 py-3 outline-none transition focus:ring-2 focus:ring-purple-500 ${
                    darkMode
                      ? "bg-slate-950 border-slate-700 text-white placeholder:text-slate-600"
                      : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                  }`}
                  required
                />
              </div>


              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full rounded-xl border px-4 py-3 outline-none transition focus:ring-2 focus:ring-purple-500 ${
                    darkMode
                      ? "bg-slate-950 border-slate-700 text-white placeholder:text-slate-600"
                      : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                  }`}
                  required
                />
              </div>


              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="Create password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full rounded-xl border px-4 py-3 outline-none transition focus:ring-2 focus:ring-purple-500 ${
                    darkMode
                      ? "bg-slate-950 border-slate-700 text-white placeholder:text-slate-600"
                      : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                  }`}
                  required
                />
              </div>


              {/* Role */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  User Role
                </label>

                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className={`w-full rounded-xl border px-4 py-3 outline-none transition focus:ring-2 focus:ring-purple-500 ${
                    darkMode
                      ? "bg-slate-950 border-slate-700 text-white"
                      : "bg-white border-slate-200 text-slate-900"
                  }`}
                >
                  <option value="VIEWER">
                    Viewer
                  </option>

                  <option value="ANALYST">
                    Analyst
                  </option>

                  <option value="ADMIN">
                    Admin
                  </option>
                </select>
              </div>


              {/* Create Button */}
              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-700 md:col-span-2"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>

                Create User
              </button>

            </form>{/* Message */}
            {message && (
              <div
                className={`mt-5 flex items-start gap-3 rounded-xl border p-4 ${
                  message.toLowerCase().includes("success")
                    ? darkMode
                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : darkMode
                    ? "border-red-500/20 bg-red-500/10 text-red-300"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                <svg
                  className="mt-0.5 h-5 w-5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>

                <p className="text-sm font-medium">
                  {message}
                </p>
              </div>
            )}

          </section>


          {/* Workspace Users */}
          <section
            className={`rounded-2xl border p-5 sm:p-7 ${
              darkMode
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-slate-200 shadow-sm"
            }`}
          >

            <div className="mb-6 flex items-center justify-between gap-4">

              <div className="flex items-center gap-3">

                <div className="rounded-xl bg-blue-500/10 p-3 text-blue-500">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  </svg>
                </div>

                <div>
                  <h3 className="text-xl font-semibold">
                    Workspace Users
                  </h3>

                  <p
                    className={`mt-1 text-sm ${
                      darkMode
                        ? "text-slate-400"
                        : "text-slate-500"
                    }`}
                  >
                    Users currently registered in this workspace.
                  </p>
                </div>

              </div>

              <div
                className={`rounded-lg px-3 py-2 text-sm font-medium ${
                  darkMode
                    ? "bg-slate-800 text-slate-300"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {users.length} users
              </div>

            </div>


            {/* Loading */}
            {loading ? (
              <div className="flex items-center justify-center py-12">

                <div
                  className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent"
                />

                <span
                  className={`ml-3 text-sm ${
                    darkMode
                      ? "text-slate-400"
                      : "text-slate-500"
                  }`}
                >
                  Loading users...
                </span>

              </div>


            ) : users.length === 0 ? (

              /* Empty State */
              <div
                className={`rounded-xl border border-dashed p-10 text-center ${
                  darkMode
                    ? "border-slate-700"
                    : "border-slate-300"
                }`}
              >

                <svg
                  className={`mx-auto h-10 w-10 ${
                    darkMode
                      ? "text-slate-600"
                      : "text-slate-400"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M16 11h6M19 8v6" />
                </svg>

                <p className="mt-4 font-medium">
                  No users found
                </p>

                <p
                  className={`mt-1 text-sm ${
                    darkMode
                      ? "text-slate-500"
                      : "text-slate-400"
                  }`}
                >
                  Create a user to add them to your workspace.
                </p>

              </div>


            ) : (

              /* Users Table */
              <div className="overflow-x-auto">

                <table className="w-full min-w-[650px]">

                  <thead>
                    <tr
                      className={`border-b text-left text-sm ${
                        darkMode
                          ? "border-slate-800 text-slate-400"
                          : "border-slate-200 text-slate-500"
                      }`}
                    >

                      <th className="px-4 py-4 font-medium">
                        User
                      </th>

                      <th className="px-4 py-4 font-medium">
                        Email
                      </th>

                      <th className="px-4 py-4 font-medium">
                        Role
                      </th>

                      <th className="px-4 py-4 font-medium">
                        Workspace
                      </th>

                    </tr>
                  </thead>


                  <tbody>

                    {users.map((user) => (

                      <tr
                        key={user.id}
                        className={`border-b last:border-0 ${
                          darkMode
                            ? "border-slate-800 hover:bg-slate-800/40"
                            : "border-slate-100 hover:bg-slate-50"
                        }`}
                      >

                        {/* User */}
                        <td className="px-4 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-500/10 font-semibold text-purple-500">
                              {user.name
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <p className="font-medium">
                                {user.name}
                              </p>

                              <p
                                className={`text-xs ${
                                  darkMode
                                    ? "text-slate-500"
                                    : "text-slate-400"
                                }`}
                              >
                                User ID #{user.id}
                              </p>
                            </div>

                          </div>

                        </td>


                        {/* Email */}
                        <td
                          className={`px-4 py-4 text-sm ${
                            darkMode
                              ? "text-slate-300"
                              : "text-slate-600"
                          }`}
                        >
                          {user.email}
                        </td>


                        {/* Role */}
                        <td className="px-4 py-4">

                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              user.role === "ADMIN"
                                ? "bg-purple-500/10 text-purple-500"
                                : user.role === "ANALYST"
                                ? "bg-blue-500/10 text-blue-500"
                                : "bg-emerald-500/10 text-emerald-500"
                            }`}
                          >
                            {user.role}
                          </span>

                        </td>


                        {/* Workspace */}
                        <td
                          className={`px-4 py-4 text-sm ${
                            darkMode
                              ? "text-slate-300"
                              : "text-slate-600"
                          }`}
                        >
                          Workspace #{user.workspaceId}
                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </section>


          {/* Footer */}
          <div
            className={`mt-8 border-t py-6 text-center text-sm ${
              darkMode
                ? "border-slate-800 text-slate-500"
                : "border-slate-200 text-slate-400"
            }`}
          >
            LOOP • Customer Feedback Intelligence
          </div>

        </div>
      </section>
    </main>
  );
}