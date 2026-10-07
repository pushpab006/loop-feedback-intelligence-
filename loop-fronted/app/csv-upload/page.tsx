"use client";

import { useEffect, useState } from "react";

export default function CSVUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
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

  const handleUpload = async () => {
    if (!file) {
      setMessage("❌ Please select a CSV file.");
      return;
    }

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setMessage("❌ Please select a CSV file.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("❌ Please login first.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch(
        "https://loop-feedback-intelligence.onrender.com/api/feedback/upload-csv",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          `❌ ${data.message || "CSV upload failed."}`
        );
        return;
      }

      setMessage(
        `✅ ${data.message || "CSV uploaded successfully!"}`
      );

      setFile(null);

      const fileInput = document.getElementById(
        "csvFile"
      ) as HTMLInputElement;

      if (fileInput) {
        fileInput.value = "";
      }

    } catch (error) {
      console.error("CSV upload error:", error);

      setMessage(
        "❌ Cannot connect to backend."
      );

    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loopUser");

    window.location.href = "/login";
  };

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
            className={`text-xs mt-1 ${
              darkMode
                ? "text-slate-500"
                : "text-slate-400"
            }`}
          >
            Customer Intelligence
          </p>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 flex-1">

          <a
            href="/dashboard"
            className={`block px-4 py-3 rounded-xl ${
              darkMode
                ? "text-slate-400 hover:bg-slate-800"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            📊 Dashboard
          </a>

          <a
            href="/add-feedback"
            className={`block px-4 py-3 rounded-xl ${
              darkMode
                ? "text-slate-400 hover:bg-slate-800"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            ➕ Add Feedback
          </a>

          <a
            href="/feedback-inbox"
            className={`block px-4 py-3 rounded-xl ${
              darkMode
                ? "text-slate-400 hover:bg-slate-800"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            📥 Feedback Inbox
          </a>

          <a
            href="/csv-upload"
            className="block px-4 py-3 rounded-xl bg-purple-600 text-white font-medium"
          >
            📄 CSV Upload
          </a>

          <a
            href="/themes-trends"
            className={`block px-4 py-3 rounded-xl ${
              darkMode
                ? "text-slate-400 hover:bg-slate-800"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            📈 Themes & Trends
          </a>

          <a
            href="/ask-loop"
            className={`block px-4 py-3 rounded-xl ${
              darkMode
                ? "text-slate-400 hover:bg-slate-800"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            ✨ Ask LOOP
          </a>

          <a
            href="/reports"
            className={`block px-4 py-3 rounded-xl ${
              darkMode
                ? "text-slate-400 hover:bg-slate-800"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            📋 Reports
          </a>

          <a
            href="/users"
            className={`block px-4 py-3 rounded-xl ${
              darkMode
                ? "text-slate-400 hover:bg-slate-800"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            👥 User Management
          </a>

        </nav>

        {/* Theme + Logout */}
        <div className="border-t border-slate-700 pt-5 space-y-2">

          <button
            type="button"
            onClick={toggleTheme}
            className={`w-full text-left px-4 py-3 rounded-xl ${
              darkMode
                ? "text-slate-300 hover:bg-slate-800"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {darkMode
              ? "☀️ Light Mode"
              : "🌙 Dark Mode"}
          </button>

          <button
            type="button"
            onClick={logout}
            className={`w-full text-left px-4 py-3 rounded-xl ${
              darkMode
                ? "text-red-400 hover:bg-red-500/10"
                : "text-red-600 hover:bg-red-50"
            }`}
          >
            🚪 Logout
          </button>

        </div>
      </aside>


      {/* Mobile Header */}
      <div
        className={`md:hidden fixed top-0 left-0 right-0 z-20 border-b px-5 py-4 flex items-center justify-between ${
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
            className={`px-3 py-2 rounded-lg ${
              darkMode
                ? "bg-slate-800"
                : "bg-slate-100"
            }`}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          <button
            type="button"
            onClick={logout}
            className="px-3 py-2 rounded-lg bg-red-500/10 text-red-500"
          >
            🚪
          </button>

        </div>
      </div>


      {/* Main Content */}
      <section className="flex-1 min-w-0">

        <div className="max-w-6xl mx-auto px-5 md:px-8 py-8 md:py-10 pt-24 md:pt-10">{/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="text-3xl font-bold">
                  CSV Bulk Upload
                </h2>

                <p
                  className={`mt-2 ${
                    darkMode
                      ? "text-slate-400"
                      : "text-slate-500"
                  }`}
                >
                  Upload multiple customer feedback records at once.
                </p>
              </div>

              <div
                className={`rounded-xl px-4 py-3 text-sm ${
                  darkMode
                    ? "bg-purple-500/10 text-purple-300"
                    : "bg-purple-50 text-purple-700"
                }`}
              >
                📄 Bulk Import
              </div>

            </div>
          </div>


          {/* Upload Card */}
          <div
            className={`rounded-2xl border p-5 sm:p-8 ${
              darkMode
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-slate-200 shadow-sm"
            }`}
          >

            {/* Upload Area */}
            <div
              className={`rounded-2xl border-2 border-dashed p-6 sm:p-12 text-center ${
                darkMode
                  ? "border-slate-700 bg-slate-950/40"
                  : "border-slate-300 bg-slate-50"
              }`}
            >

              {/* Icon */}
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/10 text-3xl">
                📄
              </div>

              <h3 className="text-xl font-semibold">
                Upload Customer Feedback
              </h3>

              <p
                className={`mx-auto mt-2 max-w-lg text-sm ${
                  darkMode
                    ? "text-slate-400"
                    : "text-slate-500"
                }`}
              >
                Select a CSV file containing multiple customer
                feedback records and import them into LOOP.
              </p>


              {/* File Input */}
              <div className="mt-7">
                <label
                  htmlFor="csvFile"
                  className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-purple-600 px-6 py-3 font-medium text-white transition hover:bg-purple-700"
                >
                  📁 Choose CSV File
                </label>

                <input
                  id="csvFile"
                  type="file"
                  accept=".csv,text/csv"
                  className="hidden"
                  onChange={(e) => {
                    const selectedFile =
                      e.target.files?.[0] || null;

                    setFile(selectedFile);
                    setMessage("");
                  }}
                />
              </div>


              {/* Selected File */}
              {file && (
                <div
                  className={`mx-auto mt-6 max-w-md rounded-xl border p-4 text-left ${
                    darkMode
                      ? "border-slate-700 bg-slate-800"
                      : "border-slate-200 bg-white"
                  }`}
                >

                  <div className="flex items-start gap-3">

                    <div className="text-2xl">
                      📄
                    </div>

                    <div className="min-w-0 flex-1">

                      <p
                        className={`text-xs ${
                          darkMode
                            ? "text-slate-400"
                            : "text-slate-500"
                        }`}
                      >
                        Selected file
                      </p>

                      <p className="mt-1 break-all font-medium">
                        {file.name}
                      </p>

                      <p
                        className={`mt-1 text-xs ${
                          darkMode
                            ? "text-slate-500"
                            : "text-slate-400"
                        }`}
                      >
                        {(file.size / 1024).toFixed(1)} KB
                      </p>

                    </div>

                  </div>

                </div>
              )}


              {/* Upload Button */}
              <button
                type="button"
                onClick={handleUpload}
                disabled={!file || loading}
                className={`mt-6 w-full max-w-md rounded-xl px-6 py-3 font-semibold transition ${
                  !file || loading
                    ? "cursor-not-allowed bg-slate-600 text-slate-300"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
              >
                {loading
                  ? "⏳ Uploading & Analyzing..."
                  : "🚀 Upload CSV"}
              </button>

            </div>{/* Upload Message */}
            {message && (
              <div
                className={`mt-6 rounded-xl border p-4 ${
                  message.startsWith("✅")
                    ? darkMode
                      ? "border-green-500/20 bg-green-500/10 text-green-300"
                      : "border-green-200 bg-green-50 text-green-700"
                    : darkMode
                    ? "border-red-500/20 bg-red-500/10 text-red-300"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                <p className="break-words text-sm font-medium">
                  {message}
                </p>
              </div>
            )}


            {/* CSV Format Guide */}
            <div
              className={`mt-8 rounded-2xl border p-5 sm:p-6 ${
                darkMode
                  ? "border-slate-800 bg-slate-950"
                  : "border-slate-200 bg-slate-50"
              }`}
            >

              <h3 className="text-lg font-semibold">
                📋 CSV Format
              </h3>

              <p
                className={`mt-2 text-sm ${
                  darkMode
                    ? "text-slate-400"
                    : "text-slate-500"
                }`}
              >
                Your CSV file should contain a column named:
              </p>

              {/* Required Column */}
              <div
                className={`mt-4 rounded-xl p-4 ${
                  darkMode
                    ? "bg-slate-900"
                    : "bg-white border border-slate-200"
                }`}
              >
                <p
                  className={`text-xs uppercase tracking-wide ${
                    darkMode
                      ? "text-slate-500"
                      : "text-slate-400"
                  }`}
                >
                  Required column
                </p>

                <code className="mt-2 block text-purple-400 font-semibold">
                  feedback
                </code>
              </div>


              {/* Example */}
              <p
                className={`mt-6 text-sm ${
                  darkMode
                    ? "text-slate-400"
                    : "text-slate-500"
                }`}
              >
                Example CSV:
              </p>

              <div className="mt-3 overflow-x-auto rounded-xl bg-slate-950 p-4">
                <pre className="min-w-max text-sm text-slate-300">
{`feedback
"The mobile app is very slow."
"Customer support was excellent."
"The checkout process keeps crashing."
"I love the new dashboard."`}
                </pre>
              </div>

            </div>


            {/* Information Cards */}
            <div className="mt-8 grid gap-4 sm:grid-cols-3">

              <div
                className={`rounded-xl border p-4 ${
                  darkMode
                    ? "border-slate-800 bg-slate-950"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <div className="text-2xl">📤</div>

                <h4 className="mt-3 font-semibold">
                  Upload
                </h4>

                <p
                  className={`mt-1 text-sm ${
                    darkMode
                      ? "text-slate-400"
                      : "text-slate-500"
                  }`}
                >
                  Import multiple feedback records at once.
                </p>
              </div>


              <div
                className={`rounded-xl border p-4 ${
                  darkMode
                    ? "border-slate-800 bg-slate-950"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <div className="text-2xl">🤖</div>

                <h4 className="mt-3 font-semibold">
                  Analyze
                </h4>

                <p
                  className={`mt-1 text-sm ${
                    darkMode
                      ? "text-slate-400"
                      : "text-slate-500"
                  }`}
                >
                  LOOP processes the uploaded feedback.
                </p>
              </div>


              <div
                className={`rounded-xl border p-4 ${
                  darkMode
                    ? "border-slate-800 bg-slate-950"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <div className="text-2xl">📊</div>

                <h4 className="mt-3 font-semibold">
                  Insights
                </h4>

                <p
                  className={`mt-1 text-sm ${
                    darkMode
                      ? "text-slate-400"
                      : "text-slate-500"
                  }`}
                >
                  View the imported feedback in LOOP analytics.
                </p>
              </div>

            </div>

          </div>


          {/* Footer */}
          <div
            className={`mt-8 border-t pt-6 text-center text-sm ${
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