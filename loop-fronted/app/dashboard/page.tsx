"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

type Feedback = {
  id: number;
  feedback: string;
  sentiment: string | null;
  score: number | null;
  featureArea: string | null;
  status: string;
  createdAt: string;
};

export default function Dashboard() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("loop-theme");

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

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.log("No login token found");
          setFeedbacks([]);
          setLoading(false);
          return;
        }

        const response = await fetch(
          "https://loop-feedback-intelligence.onrender.com/api/feedback",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        console.log(
          "Dashboard feedback response:",
          data
        );

        if (!response.ok) {
          console.error(
            "Failed to fetch feedback:",
            data
          );
          setFeedbacks([]);
          return;
        }

        if (Array.isArray(data)) {
          setFeedbacks(data);
        } else {
          console.error(
            "Expected feedback array but received:",
            data
          );
          setFeedbacks([]);
        }
      } catch (error) {
        console.error(
          "Dashboard error:",
          error
        );

        setFeedbacks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  const totalFeedback = feedbacks.length;

  const positive = feedbacks.filter(
    (item) =>
      item.sentiment === "POSITIVE"
  ).length;

  const negative = feedbacks.filter(
    (item) =>
      item.sentiment === "NEGATIVE"
  ).length;

  const neutral = feedbacks.filter(
    (item) =>
      item.sentiment === "NEUTRAL"
  ).length;

  const sentimentData = [
    {
      name: "Positive",
      value: positive,
    },
    {
      name: "Negative",
      value: negative,
    },
    {
      name: "Neutral",
      value: neutral,
    },
  ];

  const themeCount: Record<
    string,
    number
  > = {};

  feedbacks.forEach((item) => {
    const theme =
      item.featureArea || "Other";

    themeCount[theme] =
      (themeCount[theme] || 0) + 1;
  });

  const topThemes = Object.entries(
    themeCount
  )
    .sort(
      (a, b) => b[1] - a[1]
    )
    .slice(0, 5)
    .map(([name, value]) => ({
      name,
      value,
    }));

  const volumeMap: Record<
    string,
    number
  > = {};

  feedbacks.forEach((item) => {
    const date = new Date(
      item.createdAt
    ).toLocaleDateString();

    volumeMap[date] =
      (volumeMap[date] || 0) + 1;
  });

  const volumeData = Object.entries(
    volumeMap
  ).map(([date, count]) => ({
    date,
    count,
  }));

  const recentFeedback = [
    ...feedbacks,
  ]
    .sort(
      (a, b) =>
        new Date(
          b.createdAt
        ).getTime() -
        new Date(
          a.createdAt
        ).getTime()
    )
    .slice(0, 5);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("loopUser");

    window.location.href = "/login";
  }

/* ================= THEME COLORS ================= */

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

    hover: darkMode
      ? "hover:bg-[#1d1d29]"
      : "hover:bg-gray-50",
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <main
        className={`flex min-h-screen items-center justify-center ${
          darkMode
            ? "bg-[#0b0b12]"
            : "bg-[#f7f7fb]"
        }`}
      >
        <div className="text-center">

          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />

          <p
            className={
              darkMode
                ? "text-gray-400"
                : "text-gray-600"
            }
          >
            Loading LOOP dashboard...
          </p>

        </div>
      </main>
    );
  }

  return (
    <main
      className={`min-h-screen transition-colors duration-300 ${colors.page}`}
    >

    {/* ========================================================= */}
      {/* DESKTOP SIDEBAR */}
      {/* ========================================================= */}

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
              className="flex items-center gap-3 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-sm"
            >
              <span>⌂</span>
              Dashboard
            </a>

            <a
              href="/add-feedback"
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${colors.muted} ${colors.hover}`}
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
            onClick={logout}
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

      {/* ========================================================= */}
      {/* MOBILE HEADER */}
      {/* ========================================================= */}

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

          {/* Mobile Theme Button */}

          <button
            onClick={() =>
              setDarkMode(!darkMode)
            }
            className={`rounded-xl border px-3 py-2 text-sm ${colors.border}`}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

        </div>

        {/* Mobile Menu */}

        <div className="mt-4 grid grid-cols-2 gap-2">

          <a
            href="/dashboard"
            className="rounded-lg bg-indigo-600 px-3 py-2 text-center text-xs font-medium text-white"
          >
            Dashboard
          </a>

          <a
            href="/add-feedback"
            className={`rounded-lg px-3 py-2 text-center text-xs ${colors.muted} ${colors.hover}`}
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

      {/* ========================================================= */}
      {/* MAIN CONTENT */}
      {/* ========================================================= */}

      <section className="p-4 sm:p-6 lg:p-8 md:ml-64">
        <div className="mx-auto max-w-7xl">

          {/* ===================================================== */}
          {/* TOP HEADER */}
          {/* ===================================================== */}

          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <div className="mb-2 flex items-center gap-2">

                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-600">
                  AI POWERED
                </span>

                <span
                  className={`text-xs ${colors.muted}`}
                >
                  Customer Intelligence
                </span>

              </div>

              <h2
                className={`text-3xl font-bold tracking-tight sm:text-4xl ${colors.text}`}
              >
                Dashboard
              </h2>

              <p
                className={`mt-1 ${colors.muted}`}
              >
                Monitor customer feedback and discover AI-powered insights.
              </p>

            </div>

            {/* Header Buttons */}

            <div className="flex items-center gap-3">

              {/* Dark / Light Mode */}

              <button
                onClick={() =>
                  setDarkMode(!darkMode)
                }
                className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${colors.border} ${colors.hover}`}
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

              {/* Add Feedback */}

              <a
                href="/add-feedback"
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                + Add Feedback
              </a>

            </div>

          </div>

          {/* ===================================================== */}
          {/* SUMMARY CARDS */}
          {/* ===================================================== */}

          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {/* Total Feedback */}

            <div
              className={`rounded-2xl border p-5 transition ${colors.card} ${colors.border}`}
            >
              <div className="flex items-start justify-between">

                <div>
                  <p
                    className={`text-sm font-medium ${colors.muted}`}
                  >
                    Total Feedback
                  </p>

                  <h3
                    className={`mt-2 text-3xl font-bold ${colors.text}`}
                  >
                    {totalFeedback}
                  </h3>

                  <p className="mt-2 text-xs text-indigo-500">
                    Customer responses
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-xl">
                  💬
                </div>

              </div>
            </div>

            {/* Positive */}

            <div
              className={`rounded-2xl border p-5 transition ${colors.card} ${colors.border}`}
            >
              <div className="flex items-start justify-between">

                <div>
                  <p
                    className={`text-sm font-medium ${colors.muted}`}
                  >
                    Positive
                  </p>

                  <h3
                    className={`mt-2 text-3xl font-bold ${colors.text}`}
                  >
                    {positive}
                  </h3>

                  <p className="mt-2 text-xs text-green-500">
                    Positive feedback
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-xl">
                  😊
                </div>

              </div>
            </div>

            {/* Negative */}

            <div
              className={`rounded-2xl border p-5 transition ${colors.card} ${colors.border}`}
            >
              <div className="flex items-start justify-between">

                <div>
                  <p
                    className={`text-sm font-medium ${colors.muted}`}
                  >
                    Negative
                  </p>

                  <h3
                    className={`mt-2 text-3xl font-bold ${colors.text}`}
                  >
                    {negative}
                  </h3>

                  <p className="mt-2 text-xs text-red-500">
                    Needs attention
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-xl">
                  😟
                </div>

              </div>
            </div>

            {/* Neutral */}

            <div
              className={`rounded-2xl border p-5 transition ${colors.card} ${colors.border}`}
            >
              <div className="flex items-start justify-between">

                <div>
                  <p
                    className={`text-sm font-medium ${colors.muted}`}
                  >
                    Neutral
                  </p>

                  <h3
                    className={`mt-2 text-3xl font-bold ${colors.text}`}
                  >
                    {neutral}
                  </h3>

                  <p className="mt-2 text-xs text-gray-500">
                    Neutral feedback
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-xl">
                  😐
                </div>

              </div>
            </div>

          </div>

          {/* ===================================================== */}
          {/* FEEDBACK VOLUME + RECENT FEEDBACK */}
          {/* ===================================================== */}

          <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">

            {/* ================================================= */}
            {/* FEEDBACK VOLUME */}
            {/* ================================================= */}

            <div
              className={`rounded-2xl border p-6 lg:col-span-2 ${colors.card} ${colors.border}`}
            >

              <div className="mb-5 flex items-center justify-between">

                <div>
                  <h3
                    className={`text-lg font-semibold ${colors.text}`}
                  >
                    Feedback Volume
                  </h3>

                  <p
                    className={`mt-1 text-sm ${colors.muted}`}
                  >
                    Customer feedback received over time
                  </p>
                </div>

                <span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-600">
                  Activity
                </span>

              </div>

              <div className="h-64">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <LineChart
                    data={volumeData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: -15,
                      bottom: 5,
                    }}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11 }}
                    />

                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 11 }}
                    />

                    <Tooltip />

                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#6366f1"
                      strokeWidth={3}
                      dot={{
                        r: 4,
                      }}
                      activeDot={{
                        r: 6,
                      }}
                    />

                  </LineChart>

                </ResponsiveContainer>

              </div>

            </div>

            {/* ================================================= */}
            {/* QUICK INSIGHT */}
            {/* ================================================= */}

            <div
              className={`rounded-2xl border p-6 ${colors.card} ${colors.border}`}
            >

              <div className="mb-5">

                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-xl">
                  ✦
                </div>

                <h3
                  className={`text-lg font-semibold ${colors.text}`}
                >
                  AI Insight
                </h3>

                <p
                  className={`mt-1 text-sm ${colors.muted}`}
                >
                  Quick summary from your feedback
                </p>

              </div>

              <div
                className={`rounded-xl border p-4 ${colors.border} ${
                  darkMode
                    ? "bg-indigo-500/10"
                    : "bg-indigo-50"
                }`}
              >

                <p
                  className={`text-sm leading-6 ${colors.text}`}
                >
                  {totalFeedback === 0
                    ? "No feedback has been added yet. Add customer feedback to start generating insights."
                    : positive > negative
                    ? "Customers are showing more positive sentiment. Keep monitoring negative feedback for improvement opportunities."
                    : negative > positive
                    ? "Negative feedback is currently higher. Review customer concerns and identify areas that need improvement."
                    : "Customer sentiment is currently mixed. Review the feedback themes to understand customer needs."}
                </p>

              </div>

              <a
                href="/ask-loop"
                className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Ask LOOP AI →
              </a>

            </div>

          </div>

          {/* ===================================================== */}
          {/* RECENT FEEDBACK */}
          {/* ===================================================== */}

          <div
            className={`mb-8 overflow-hidden rounded-2xl border ${colors.card} ${colors.border}`}
          >

            {/* Header */}

            <div className="flex flex-col gap-3 border-b p-6 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h3
                  className={`text-lg font-semibold ${colors.text}`}
                >
                  Recent Feedback
                </h3>

                <p
                  className={`mt-1 text-sm ${colors.muted}`}
                >
                  Latest customer responses analyzed by LOOP AI
                </p>
              </div>

              <a
                href="/feedback-inbox"
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                View All →
              </a>

            </div>

            {/* Feedback List */}

            {recentFeedback.length === 0 ? (

              <div className="p-10 text-center">

                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-xl">
                  💬
                </div>

                <p
                  className={`font-medium ${colors.text}`}
                >
                  No feedback yet
                </p>

                <p
                  className={`mt-1 text-sm ${colors.muted}`}
                >
                  Add your first customer feedback to see it here.
                </p>

                <a
                  href="/add-feedback"
                  className="mt-5 inline-block rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  + Add Feedback
                </a>

              </div>

            ) : (

              <div className="divide-y">

                {recentFeedback.map((item) => (

                  <div
                    key={item.id}
                    className={`p-5 transition ${colors.hover}`}
                  >

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                      {/* Feedback Text */}

                      <div className="min-w-0 flex-1">

                        <div className="mb-2 flex flex-wrap items-center gap-2">

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              item.sentiment === "POSITIVE"
                                ? "bg-green-100 text-green-700"
                                : item.sentiment === "NEGATIVE"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {item.sentiment || "NEUTRAL"}
                          </span>

                          {item.featureArea && (

                            <span
                              className={`rounded-full border px-2.5 py-1 text-xs ${colors.border} ${colors.muted}`}
                            >
                              {item.featureArea}
                            </span>

                          )}

                        </div>

                        <p
                          className={`line-clamp-2 text-sm leading-6 ${colors.text}`}
                        >
                          {item.feedback}
                        </p>

                        <p
                          className={`mt-2 text-xs ${colors.muted}`}
                        >
                          {new Date(
                            item.createdAt
                          ).toLocaleDateString()}
                        </p>

                      </div>

                      {/* Score */}

                      <div className="shrink-0">

                        <div
                          className={`rounded-xl border px-4 py-2 text-center ${colors.border}`}
                        >

                          <p
                            className={`text-[10px] uppercase tracking-wide ${colors.muted}`}
                          >
                            Score
                          </p>

                          <p
                            className={`mt-1 text-lg font-bold ${colors.text}`}
                          >
                            {item.score !== null
                              ? item.score
                              : "—"}
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

          {/* ===================================================== */}
          {/* FOOTER */}
          {/* ===================================================== */}

          <div
            className={`border-t pt-6 ${colors.border}`}
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
      </section>

    </main>
  );
}