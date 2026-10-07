"use client";

import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

export default function AddFeedback() {
  const [feedback, setFeedback] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme =
      localStorage.getItem("loop-theme");

    if (savedTheme === "dark") {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "loop-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  const colors = {
    page: darkMode
      ? "bg-[#0b0b12] text-white"
      : "bg-[#f7f7fb] text-gray-900",

    sidebar: darkMode
      ? "bg-[#11111a] border-[#242432]"
      : "bg-white border-gray-200",

    card: darkMode
      ? "bg-[#15151f] border-[#272735]"
      : "bg-white border-gray-200",

    text: darkMode
      ? "text-white"
      : "text-gray-900",

    muted: darkMode
      ? "text-gray-400"
      : "text-gray-500",

    border: darkMode
      ? "border-[#292936]"
      : "border-gray-200",

    input: darkMode
      ? "bg-[#11111a] border-[#30303d] text-white placeholder:text-gray-500"
      : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400",

    hover: darkMode
      ? "hover:bg-[#1d1d29]"
      : "hover:bg-gray-50",
  };

  const handleSubmit = async (
    e: FormEvent
  ) => {
    e.preventDefault();

    if (!feedback.trim()) {
      setMessage("Please enter feedback.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const token =
        localStorage.getItem("token");

      if (!token) {
        setMessage("❌ Please login again.");
        return;
      }

      const response = await fetch(
        "https://loop-feedback-intelligence.onrender.com/api/feedback",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            feedback: feedback,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(
          "✅ Feedback submitted successfully!"
        );
        setFeedback("");
      } else {
        setMessage(
          `❌ ${data.message}`
        );
      }
    } catch {
      setMessage(
        "❌ Cannot connect to backend."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className={`min-h-screen transition-colors duration-300 ${colors.page}`}
    >
      {/* ===================================================== */}
      {/* SIDEBAR */}
      {/* ===================================================== */}

      <aside
        className={`fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r md:flex ${colors.sidebar}`}
      >
        {/* Logo */}

        <div className="px-6 pb-6 pt-7">
          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">
              L
            </div>

            <div>
              <h1
                className={`text-xl font-bold ${colors.text}`}
              >
                LOOP
              </h1>

              <p
                className={`text-[10px] ${colors.muted}`}
              >
                Feedback Intelligence
              </p>
            </div>

          </div>
        </div>

        {/* Navigation */}

        <div className="flex-1 px-4">

          <p
            className={`mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider ${colors.muted}`}
          >
            Main Menu
          </p>

          <nav className="space-y-1">

            <a
              href="/dashboard"
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${colors.muted} ${colors.hover}`}
            >
              <span>⌂</span>
              Dashboard
            </a>

            <a
              href="/add-feedback"
              className="flex items-center gap-3 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-sm"
            >
              <span>＋</span>
              Add Feedback
            </a>

            <a
              href="/feedback-inbox"
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${colors.muted} ${colors.hover}`}
            >
              <span>▤</span>
              Feedback Inbox
            </a>

            <a
              href="/themes-trends"
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${colors.muted} ${colors.hover}`}
            >
              <span>◈</span>
              Themes & Trends
            </a>

            <a
              href="/ask-loop"
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${colors.muted} ${colors.hover}`}
            >
              <span>✦</span>
              Ask LOOP
            </a>

            <a
              href="/reports"
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${colors.muted} ${colors.hover}`}
            >
              <span>▥</span>
              Reports
            </a>

            <a
              href="/csv-upload"
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${colors.muted} ${colors.hover}`}
            >
              <span>⇧</span>
              CSV Upload
            </a>

          </nav>

          <p
            className={`mb-3 mt-8 px-3 text-[11px] font-semibold uppercase tracking-wider ${colors.muted}`}
          >
            Administration
          </p>

          <a
            href="/users"
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${colors.muted} ${colors.hover}`}
          >
            <span>♙</span>
            User Management
          </a>

        </div>

        {/* Logout */}

        <div
          className={`border-t p-4 ${colors.border}`}
        >
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("loopUser");
              window.location.href = "/login";
            }}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 transition ${
              darkMode
                ? "hover:bg-red-500/10"
                : "hover:bg-red-50"
            }`}
          >
            <span>↪</span>
            Logout
          </button>
        </div>

      </aside>

      {/* ===================================================== */}
      {/* MAIN CONTENT */}
      {/* ===================================================== */}

      <section className="p-4 sm:p-6 lg:p-8 md:ml-64">
        <div className="mx-auto max-w-5xl">

          {/* ================================================= */}
          {/* HEADER */}
          {/* ================================================= */}

          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <div className="mb-2 flex items-center gap-2">

                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-600">
                  FEEDBACK
                </span>

                <span
                  className={`text-xs ${colors.muted}`}
                >
                  Customer Intelligence
                </span>

              </div>

              <h2
                className={`text-3xl font-bold tracking-tight ${colors.text}`}
              >
                Add Feedback
              </h2>

              <p
                className={`mt-1 ${colors.muted}`}
              >
                Add customer feedback and let LOOP AI analyze it.
              </p>

            </div>

            {/* Theme Button */}

            <button
              type="button"
              onClick={() =>
                setDarkMode(!darkMode)
              }
              className={`flex items-center gap-2 self-start rounded-xl border px-4 py-2.5 text-sm font-medium transition sm:self-auto ${colors.border} ${colors.hover}`}
            >
              <span>
                {darkMode
                  ? "☀️"
                  : "🌙"}
              </span>

              {darkMode
                ? "Light Mode"
                : "Dark Mode"}
            </button>

          </div>

          {/* ================================================= */}
          {/* FEEDBACK FORM */}
          {/* ================================================= */}

          <div
            className={`rounded-2xl border p-6 shadow-sm sm:p-8 ${colors.card} ${colors.border}`}
          >

            {/* Form Title */}

            <div className="mb-6 flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-xl">
                💬
              </div>

              <div>
                <h3
                  className={`text-lg font-semibold ${colors.text}`}
                >
                  Customer Feedback
                </h3>

                <p
                  className={`mt-1 text-sm ${colors.muted}`}
                >
                  Enter the customer's feedback below.
                </p>
              </div>

            </div>

            <form onSubmit={handleSubmit}>

              {/* Feedback Label */}

              <div className="mb-2 flex items-center justify-between">

                <label
                  htmlFor="feedback"
                  className={`text-sm font-semibold ${colors.text}`}
                >
                  Feedback
                </label>

                <span
                  className={`text-xs ${colors.muted}`}
                >
                  {feedback.length} characters
                </span>

              </div>

              {/* Textarea */}

              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) =>
                  setFeedback(e.target.value)
                }
                placeholder="Enter customer feedback here..."
                className={`min-h-[220px] w-full resize-none rounded-xl border p-4 text-sm leading-6 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 ${colors.input}`}
              />

              <p
                className={`mt-2 text-xs ${colors.muted}`}
              >
                LOOP AI will analyze the feedback for sentiment,
                themes, and customer insights.
              </p>

              {/* Submit */}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">

                <a
                  href="/dashboard"
                  className={`rounded-xl border px-5 py-3 text-center text-sm font-semibold transition ${colors.border} ${colors.hover}`}
                >
                  Cancel
                </a>

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Analyzing..."
                    : "Submit Feedback →"}
                </button>

              </div>

            </form>

            {/* ================================================= */}
            {/* STATUS MESSAGE */}
            {/* ================================================= */}

            {message && (
              <div
                className={`mt-5 rounded-xl border p-4 text-sm font-medium ${
                  message.startsWith("✅")
                    ? darkMode
                      ? "border-green-500/30 bg-green-500/10 text-green-400"
                      : "border-green-200 bg-green-50 text-green-700"
                    : darkMode
                    ? "border-red-500/30 bg-red-500/10 text-red-400"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {message}
              </div>
            )}

          </div>

          {/* ===================================================== */}
      {/* MOBILE HEADER */}
      {/* ===================================================== */}

      <div
        className={`border-b p-4 md:hidden ${colors.sidebar} ${colors.border}`}
      >
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white">
              L
            </div>

            <div>
              <h1
                className={`font-bold ${colors.text}`}
              >
                LOOP
              </h1>

              <p
                className={`text-[10px] ${colors.muted}`}
              >
                Feedback Intelligence
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={() =>
              setDarkMode(!darkMode)
            }
            className={`rounded-xl border px-3 py-2 text-sm ${colors.border}`}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

        </div>

        {/* Mobile Navigation */}

        <div className="mt-4 grid grid-cols-2 gap-2">

          <a
            href="/dashboard"
            className={`rounded-lg px-3 py-2 text-center text-xs ${colors.muted} ${colors.hover}`}
          >
            Dashboard
          </a>

          <a
            href="/add-feedback"
            className="rounded-lg bg-indigo-600 px-3 py-2 text-center text-xs font-medium text-white"
          >
            Add Feedback
          </a>

          <a
            href="/feedback-inbox"
            className={`rounded-lg px-3 py-2 text-center text-xs ${colors.muted} ${colors.hover}`}
          >
            Inbox
          </a>

          <a
            href="/themes-trends"
            className={`rounded-lg px-3 py-2 text-center text-xs ${colors.muted} ${colors.hover}`}
          >
            Themes
          </a>

          <a
            href="/ask-loop"
            className={`rounded-lg px-3 py-2 text-center text-xs ${colors.muted} ${colors.hover}`}
          >
            Ask LOOP
          </a>

          <a
            href="/reports"
            className={`rounded-lg px-3 py-2 text-center text-xs ${colors.muted} ${colors.hover}`}
          >
            Reports
          </a>

          <a
            href="/csv-upload"
            className={`rounded-lg px-3 py-2 text-center text-xs ${colors.muted} ${colors.hover}`}
          >
            CSV Upload
          </a>

          <a
            href="/users"
            className={`rounded-lg px-3 py-2 text-center text-xs ${colors.muted} ${colors.hover}`}
          >
            Users
          </a>

        </div>
      </div>

      {/* ===================================================== */}
      {/* FOOTER */}
      {/* ===================================================== */}

      <div className="px-4 pb-6 md:ml-64 md:px-8">

        <div
          className={`mx-auto max-w-5xl border-t pt-6 ${colors.border}`}
        >

          <div className="flex flex-col gap-2 text-center text-xs sm:flex-row sm:items-center sm:justify-between sm:text-left">

            <p className={colors.muted}>
              © 2026 LOOP — Feedback Intelligence Platform
            </p>

            <p className={colors.muted}>
              Powered by AI • Built with Next.js
            </p>

          </div>

        </div>

    </div>

      {/* ===================================================== */}
      {/* CLOSE MAIN CONTENT SECTION */}
      {/* ===================================================== */}

      </div>
    </section>

    </main>
  );
}