"use client";

import { useEffect, useState } from "react";

type Feedback = {
  id: number;
  feedback: string;
  sentiment: string | null;
  score: number | null;
  featureArea: string | null;
  status: string;
  createdAt: string;
};

export default function Reports() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem("loop-theme");

    if (savedTheme === "light") {
      setDarkMode(false);
    }
  }, []);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login again.");
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

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch feedback"
          );
        }

        if (!Array.isArray(data)) {
          throw new Error("Invalid feedback data");
        }

        setFeedbacks(data);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Cannot connect to backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;

    setDarkMode(newMode);

    localStorage.setItem(
      "loop-theme",
      newMode ? "dark" : "light"
    );
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loopUser");

    window.location.href = "/login";
  };

  const analyzedFeedback = feedbacks.filter(
    (item) => item.sentiment
  );

  const positive = feedbacks.filter(
    (item) => item.sentiment === "POSITIVE"
  ).length;

  const negative = feedbacks.filter(
    (item) => item.sentiment === "NEGATIVE"
  ).length;

  const neutral = feedbacks.filter(
    (item) => item.sentiment === "NEUTRAL"
  ).length;

  const positivePercentage =
    feedbacks.length > 0
      ? Math.round((positive / feedbacks.length) * 100)
      : 0;

  const negativePercentage =
    feedbacks.length > 0
      ? Math.round((negative / feedbacks.length) * 100)
      : 0;

  const neutralPercentage =
    feedbacks.length > 0
      ? Math.round((neutral / feedbacks.length) * 100)
      : 0;

  const themeCounts: { [key: string]: number } = {};

  feedbacks.forEach((item) => {
    const theme = item.featureArea || "Other";

    themeCounts[theme] =
      (themeCounts[theme] || 0) + 1;
  });

  const topThemes = Object.entries(themeCounts)
    .map(([name, count]) => ({
      name,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const topTheme =
    topThemes.length > 0
      ? topThemes[0].name
      : "No data";

  return (
    <main
      className={
        darkMode
          ? "min-h-screen bg-slate-950 text-white flex"
          : "min-h-screen bg-slate-50 text-slate-900 flex"
      }
    >{/* Sidebar */}
      <aside
        className={`hidden md:flex w-64 flex-col border-r p-6 ${
          darkMode
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-slate-200"
        }`}
      >
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
            className={`block px-4 py-3 rounded-xl ${
              darkMode
                ? "text-slate-400 hover:bg-slate-800"
                : "text-slate-600 hover:bg-slate-100"
            }`}
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
            className="block px-4 py-3 rounded-xl bg-purple-600 text-white font-medium"
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
        <h1 className="text-2xl font-bold text-purple-500">
          LOOP
        </h1>

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

        <div className="max-w-7xl mx-auto px-5 md:px-8 py-8 md:py-10 pt-24 md:pt-10">{/* Report Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

            <div>
              <p
                className={`text-sm font-medium mb-2 ${
                  darkMode
                    ? "text-purple-400"
                    : "text-purple-600"
                }`}
              >
                REPORTS
              </p>

              <h2 className="text-3xl md:text-4xl font-bold">
                Voice of Customer Report
              </h2>

              <p
                className={`mt-2 max-w-2xl ${
                  darkMode
                    ? "text-slate-400"
                    : "text-slate-500"
                }`}
              >
                Understand what customers are saying,
                identify important concerns, and discover
                opportunities for improvement.
              </p>
            </div>

            <div className="flex gap-3">

              <a
                href="/feedback-inbox"
                className={`px-5 py-3 rounded-xl font-medium transition ${
                  darkMode
                    ? "bg-slate-800 hover:bg-slate-700 text-white"
                    : "bg-white border border-slate-200 hover:bg-slate-100"
                }`}
              >
                View Feedback
              </a>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium transition"
              >
                🖨️ Print Report
              </button>

            </div>

          </div>{/* Report Overview */}

          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

              {/* Total Feedback */}
              <div
                className={`rounded-2xl border p-6 ${
                  darkMode
                    ? "bg-slate-900 border-slate-800"
                    : "bg-white border-slate-200"
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
                      TOTAL FEEDBACK
                    </p>

                    <h3 className="text-3xl font-bold mt-2">
                      {feedbacks.length}
                    </h3>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-2xl">
                    💬
                  </div>

                </div>

                <p
                  className={`text-xs mt-4 ${
                    darkMode
                      ? "text-slate-500"
                      : "text-slate-400"
                  }`}
                >
                  Customer responses collected
                </p>
              </div>


              {/* Positive */}
              <div
                className={`rounded-2xl border p-6 ${
                  darkMode
                    ? "bg-slate-900 border-slate-800"
                    : "bg-white border-slate-200"
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
                      POSITIVE
                    </p>

                    <h3 className="text-3xl font-bold mt-2 text-emerald-400">
                      {positivePercentage}%
                    </h3>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-2xl">
                    😊
                  </div>

                </div>

                <p
                  className={`text-xs mt-4 ${
                    darkMode
                      ? "text-slate-500"
                      : "text-slate-400"
                  }`}
                >
                  {positive} positive responses
                </p>
              </div>


              {/* Negative */}
              <div
                className={`rounded-2xl border p-6 ${
                  darkMode
                    ? "bg-slate-900 border-slate-800"
                    : "bg-white border-slate-200"
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
                      NEGATIVE
                    </p>

                    <h3 className="text-3xl font-bold mt-2 text-red-400">
                      {negativePercentage}%
                    </h3>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-2xl">
                    😟
                  </div>

                </div>

                <p
                  className={`text-xs mt-4 ${
                    darkMode
                      ? "text-slate-500"
                      : "text-slate-400"
                  }`}
                >
                  {negative} negative responses
                </p>
              </div>


              {/* Neutral */}
              <div
                className={`rounded-2xl border p-6 ${
                  darkMode
                    ? "bg-slate-900 border-slate-800"
                    : "bg-white border-slate-200"
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
                      NEUTRAL
                    </p>

                    <h3 className="text-3xl font-bold mt-2 text-amber-400">
                      {neutralPercentage}%
                    </h3>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-2xl">
                    😐
                  </div>

                </div>

                <p
                  className={`text-xs mt-4 ${
                    darkMode
                      ? "text-slate-500"
                      : "text-slate-400"
                  }`}
                >
                  {neutral} neutral responses
                </p>
              </div>

            </div>
          )}{/* Sentiment Overview */}

          {!loading && !error && (
            <div
              className={`rounded-2xl border p-6 md:p-7 mb-8 ${
                darkMode
                  ? "bg-slate-900 border-slate-800"
                  : "bg-white border-slate-200"
              }`}
            >
              <div className="mb-6">
                <h3 className="text-xl font-semibold">
                  Customer Sentiment
                </h3>

                <p
                  className={`text-sm mt-1 ${
                    darkMode
                      ? "text-slate-400"
                      : "text-slate-500"
                  }`}
                >
                  Overall customer sentiment based on available feedback analysis.
                </p>
              </div>

              <div className="space-y-6">

                {/* Positive */}
                <div>
                  <div className="flex justify-between items-center mb-2">

                    <div className="flex items-center gap-2">
                      <span className="text-lg">😊</span>

                      <span className="font-medium">
                        Positive
                      </span>
                    </div>

                    <span className="text-sm text-emerald-400 font-semibold">
                      {positive} ({positivePercentage}%)
                    </span>

                  </div>

                  <div
                    className={`h-3 rounded-full overflow-hidden ${
                      darkMode
                        ? "bg-slate-800"
                        : "bg-slate-100"
                    }`}
                  >
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                      style={{
                        width: `${positivePercentage}%`,
                      }}
                    />
                  </div>
                </div>


                {/* Negative */}
                <div>
                  <div className="flex justify-between items-center mb-2">

                    <div className="flex items-center gap-2">
                      <span className="text-lg">😟</span>

                      <span className="font-medium">
                        Negative
                      </span>
                    </div>

                    <span className="text-sm text-red-400 font-semibold">
                      {negative} ({negativePercentage}%)
                    </span>

                  </div>

                  <div
                    className={`h-3 rounded-full overflow-hidden ${
                      darkMode
                        ? "bg-slate-800"
                        : "bg-slate-100"
                    }`}
                  >
                    <div
                      className="h-full rounded-full bg-red-500 transition-all duration-500"
                      style={{
                        width: `${negativePercentage}%`,
                      }}
                    />
                  </div>
                </div>


                {/* Neutral */}
                <div>
                  <div className="flex justify-between items-center mb-2">

                    <div className="flex items-center gap-2">
                      <span className="text-lg">😐</span>

                      <span className="font-medium">
                        Neutral
                      </span>
                    </div>

                    <span className="text-sm text-amber-400 font-semibold">
                      {neutral} ({neutralPercentage}%)
                    </span>

                  </div>

                  <div
                    className={`h-3 rounded-full overflow-hidden ${
                      darkMode
                        ? "bg-slate-800"
                        : "bg-slate-100"
                    }`}
                  >
                    <div
                      className="h-full rounded-full bg-amber-500 transition-all duration-500"
                      style={{
                        width: `${neutralPercentage}%`,
                      }}
                    />
                  </div>
                </div>

              </div>

              {/* Analysis note */}
              <div
                className={`mt-7 p-4 rounded-xl ${
                  darkMode
                    ? "bg-purple-500/10 border border-purple-500/20"
                    : "bg-purple-50 border border-purple-100"
                }`}
              >
                <p
                  className={`text-sm ${
                    darkMode
                      ? "text-purple-200"
                      : "text-purple-700"
                  }`}
                >
                  <span className="font-semibold">
                    Report insight:
                  </span>{" "}
                  {analyzedFeedback.length > 0
                    ? `${analyzedFeedback.length} feedback responses currently have sentiment analysis available.`
                    : "No AI-analyzed feedback is available yet."}
                </p>
              </div>

            </div>
          )}{/* Top Customer Themes */}

          {!loading && !error && (
            <div
              className={`rounded-2xl border p-6 md:p-7 mb-8 ${
                darkMode
                  ? "bg-slate-900 border-slate-800"
                  : "bg-white border-slate-200"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">

                <div>
                  <h3 className="text-xl font-semibold">
                    Top Customer Themes
                  </h3>

                  <p
                    className={`text-sm mt-1 ${
                      darkMode
                        ? "text-slate-400"
                        : "text-slate-500"
                    }`}
                  >
                    The most frequently mentioned areas in customer feedback.
                  </p>
                </div>

                <a
                  href="/themes-trends"
                  className="text-sm text-purple-400 hover:text-purple-300 font-medium"
                >
                  View all themes →
                </a>

              </div>

              {topThemes.length === 0 ? (

                <div
                  className={`text-center py-10 rounded-xl ${
                    darkMode
                      ? "bg-slate-800/50"
                      : "bg-slate-50"
                  }`}
                >
                  <div className="text-4xl mb-3">
                    📊
                  </div>

                  <p
                    className={`font-medium ${
                      darkMode
                        ? "text-slate-300"
                        : "text-slate-700"
                    }`}
                  >
                    No themes available yet
                  </p>

                  <p
                    className={`text-sm mt-1 ${
                      darkMode
                        ? "text-slate-500"
                        : "text-slate-400"
                    }`}
                  >
                    Add customer feedback to generate themes.
                  </p>
                </div>

              ) : (

                <div className="space-y-5">

                  {topThemes.map((theme, index) => {

                    const percentage =
                      feedbacks.length > 0
                        ? Math.round(
                            (theme.count / feedbacks.length) * 100
                          )
                        : 0;

                    return (
                      <div key={theme.name}>

                        <div className="flex items-center justify-between gap-4 mb-2">

                          <div className="flex items-center gap-3 min-w-0">

                            <div
                              className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold ${
                                index === 0
                                  ? "bg-purple-500/15 text-purple-400"
                                  : darkMode
                                  ? "bg-slate-800 text-slate-400"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {index + 1}
                            </div>

                            <div className="min-w-0">
                              <p className="font-semibold truncate">
                                {theme.name}
                              </p>

                              <p
                                className={`text-xs ${
                                  darkMode
                                    ? "text-slate-500"
                                    : "text-slate-400"
                                }`}
                              >
                                {theme.count} feedback
                              </p>
                            </div>

                          </div>

                          <span className="text-sm font-semibold text-purple-400">
                            {percentage}%
                          </span>

                        </div>

                        <div
                          className={`h-2.5 rounded-full overflow-hidden ${
                            darkMode
                              ? "bg-slate-800"
                              : "bg-slate-100"
                          }`}
                        >
                          <div
                            className="h-full rounded-full bg-purple-500 transition-all duration-500"
                            style={{
                              width: `${percentage}%`,
                            }}
                          />
                        </div>

                      </div>
                    );
                  })}

                </div>

              )}

            </div>
          )}{/* Customer Insights */}

          {!loading && !error && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

              {/* Customer Insight */}
              <div
                className={`rounded-2xl border p-6 md:p-7 ${
                  darkMode
                    ? "bg-slate-900 border-slate-800"
                    : "bg-white border-slate-200"
                }`}
              >
                <div className="flex items-center gap-3 mb-5">

                  <div className="w-11 h-11 rounded-xl bg-purple-500/10 flex items-center justify-center text-xl">
                    ✨
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold">
                      Customer Insights
                    </h3>

                    <p
                      className={`text-xs ${
                        darkMode
                          ? "text-slate-500"
                          : "text-slate-400"
                      }`}
                    >
                      Key observations from feedback
                    </p>
                  </div>

                </div>

                {feedbacks.length === 0 ? (

                  <p
                    className={`text-sm ${
                      darkMode
                        ? "text-slate-400"
                        : "text-slate-500"
                    }`}
                  >
                    Add customer feedback to generate useful insights.
                  </p>

                ) : (

                  <div className="space-y-4">

                    <div
                      className={`p-4 rounded-xl ${
                        darkMode
                          ? "bg-slate-800/70"
                          : "bg-slate-50"
                      }`}
                    >
                      <p className="text-sm font-medium">
                        Overall feedback volume
                      </p>

                      <p
                        className={`text-sm mt-1 ${
                          darkMode
                            ? "text-slate-400"
                            : "text-slate-500"
                        }`}
                      >
                        LOOP has collected{" "}
                        <span className="font-semibold text-purple-400">
                          {feedbacks.length}
                        </span>{" "}
                        customer feedback responses.
                      </p>
                    </div>

                    <div
                      className={`p-4 rounded-xl ${
                        darkMode
                          ? "bg-slate-800/70"
                          : "bg-slate-50"
                      }`}
                    >
                      <p className="text-sm font-medium">
                        Current leading theme
                      </p>

                      <p
                        className={`text-sm mt-1 ${
                          darkMode
                            ? "text-slate-400"
                            : "text-slate-500"
                        }`}
                      >
                        <span className="font-semibold text-purple-400">
                          {topTheme}
                        </span>{" "}
                        is currently the most frequently mentioned theme.
                      </p>
                    </div>

                    <div
                      className={`p-4 rounded-xl ${
                        darkMode
                          ? "bg-slate-800/70"
                          : "bg-slate-50"
                      }`}
                    >
                      <p className="text-sm font-medium">
                        Sentiment signal
                      </p>

                      <p
                        className={`text-sm mt-1 ${
                          darkMode
                            ? "text-slate-400"
                            : "text-slate-500"
                        }`}
                      >
                        Positive feedback currently represents{" "}
                        <span className="font-semibold text-emerald-400">
                          {positivePercentage}%
                        </span>{" "}
                        of all collected responses.
                      </p>
                    </div>

                  </div>

                )}

              </div>


              {/* Recommended Actions */}
              <div
                className={`rounded-2xl border p-6 md:p-7 ${
                  darkMode
                    ? "bg-slate-900 border-slate-800"
                    : "bg-white border-slate-200"
                }`}
              >
                <div className="flex items-center gap-3 mb-5">

                  <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center text-xl">
                    🎯
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold">
                      Recommended Actions
                    </h3>

                    <p
                      className={`text-xs ${
                        darkMode
                          ? "text-slate-500"
                          : "text-slate-400"
                      }`}
                    >
                      Areas worth reviewing
                    </p>
                  </div>

                </div>

                {topThemes.length === 0 ? (

                  <p
                    className={`text-sm ${
                      darkMode
                        ? "text-slate-400"
                        : "text-slate-500"
                    }`}
                  >
                    Add more feedback to generate recommendations.
                  </p>

                ) : (

                  <div className="space-y-4">

                    {topThemes.slice(0, 3).map((theme, index) => (

                      <div
                        key={theme.name}
                        className={`flex gap-4 p-4 rounded-xl ${
                          darkMode
                            ? "bg-slate-800/70"
                            : "bg-slate-50"
                        }`}
                      >

                        <div className="w-8 h-8 shrink-0 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </div>

                        <div>
                          <p className="font-medium">
                            Review {theme.name}
                          </p>

                          <p
                            className={`text-sm mt-1 ${
                              darkMode
                                ? "text-slate-400"
                                : "text-slate-500"
                            }`}
                          >
                            Review customer feedback related to{" "}
                            <span className="font-medium text-purple-400">
                              {theme.name}
                            </span>{" "}
                            and identify possible improvements.
                          </p>
                        </div>

                      </div>

                    ))}

                  </div>

                )}

              </div>

            </div>
          )}{/* Loading State */}

          {loading && (
            <div
              className={`rounded-2xl border p-10 text-center ${
                darkMode
                  ? "bg-slate-900 border-slate-800"
                  : "bg-white border-slate-200"
              }`}
            >
              <div className="text-4xl mb-4">
                📊
              </div>

              <p className="font-semibold">
                Loading Voice of Customer Report...
              </p>

              <p
                className={`text-sm mt-2 ${
                  darkMode
                    ? "text-slate-400"
                    : "text-slate-500"
                }`}
              >
                Analyzing available customer feedback.
              </p>
            </div>
          )}


          {/* Error State */}

          {!loading && error && (
            <div
              className={`rounded-2xl border p-8 ${
                darkMode
                  ? "bg-red-500/10 border-red-500/20"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <div className="flex items-start gap-4">

                <div className="text-2xl">
                  ⚠️
                </div>

                <div>
                  <h3 className="font-semibold text-red-400">
                    Unable to load report
                  </h3>

                  <p
                    className={`text-sm mt-1 ${
                      darkMode
                        ? "text-red-300/80"
                        : "text-red-600"
                    }`}
                  >
                    {error}
                  </p>

                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600"
                  >
                    Try Again
                  </button>
                </div>

              </div>
            </div>
          )}


          {/* Report Footer */}

          {!loading && !error && (
            <div
              className={`mt-8 pt-6 border-t text-center ${
                darkMode
                  ? "border-slate-800 text-slate-500"
                  : "border-slate-200 text-slate-400"
              }`}
            >
              <p className="text-xs">
                LOOP · Voice of Customer Report
              </p>

              <p className="text-xs mt-1">
                Customer feedback intelligence platform
              </p>
            </div>
          )}

        </div>
      </section>
    </main>
  );
}