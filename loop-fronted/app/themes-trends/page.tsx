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

export default function ThemesTrends() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

  const fetchFeedback = async () => {
    try {
      setLoading(true);

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

  useEffect(() => {
    fetchFeedback();
  }, []);
  const themeCounts: {
    [key: string]: number;
  } = {};

  feedbacks.forEach((item) => {
    const theme = item.featureArea || "Other";

    themeCounts[theme] =
      (themeCounts[theme] || 0) + 1;
  });

  const themes = Object.entries(themeCounts)
    .map(([name, feedback]) => ({
      name,
      feedback,
    }))
    .sort((a, b) => b.feedback - a.feedback);

  const topTheme = themes[0];

  const totalThemes = themes.length;

  const totalFeedback = feedbacks.length;

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("loopUser");

    window.location.href = "/login";
  }
  return (
    <main
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-[#0b0b12] text-white"
          : "bg-[#f7f7fb] text-gray-900"
      }`}
    >

      {/* DESKTOP SIDEBAR */}

      <aside
        className={`fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r md:flex ${
          darkMode
            ? "border-[#242432] bg-[#11111a]"
            : "border-gray-200 bg-white"
        }`}
      >

        <div className="flex h-full flex-col p-6">

          {/* LOGO */}

          <div className="mb-8">

            <h1 className="text-2xl font-bold text-purple-600">
              LOOP
            </h1>

            <p
              className={`mt-1 text-xs ${
                darkMode
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}
            >
              Customer Feedback Intelligence
            </p>

          </div>

          {/* NAVIGATION */}

          <nav className="space-y-1">

            <a
              href="/dashboard"
              className="block rounded-xl px-4 py-3 text-sm font-medium hover:bg-purple-50"
            >
              Dashboard
            </a>

            <a
              href="/add-feedback"
              className="block rounded-xl px-4 py-3 text-sm font-medium hover:bg-purple-50"
            >
              Add Feedback
            </a>

            <a
              href="/feedback-inbox"
              className="block rounded-xl px-4 py-3 text-sm font-medium hover:bg-purple-50"
            >
              Feedback Inbox
            </a>

            <a
              href="/themes-trends"
              className="block rounded-xl bg-purple-100 px-4 py-3 text-sm font-semibold text-purple-700"
            >
              Themes & Trends
            </a>

            <a
              href="/ask-loop"
              className="block rounded-xl px-4 py-3 text-sm font-medium hover:bg-purple-50"
            >
              Ask LOOP
            </a>

            <a
              href="/reports"
              className="block rounded-xl px-4 py-3 text-sm font-medium hover:bg-purple-50"
            >
              Reports
            </a>

            <a
              href="/csv-upload"
              className="block rounded-xl px-4 py-3 text-sm font-medium hover:bg-purple-50"
            >
              CSV Upload
            </a>

            <a
              href="/users"
              className="block rounded-xl px-4 py-3 text-sm font-medium hover:bg-purple-50"
            >
              User Management
            </a>

          </nav>

          {/* BOTTOM BUTTONS */}

          <div className="mt-auto">

            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className={`mb-3 w-full rounded-xl border px-4 py-3 text-sm ${
                darkMode
                  ? "border-[#30303d] hover:bg-[#1d1d29]"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              {darkMode
                ? "☀️ Light Mode"
                : "🌙 Dark Mode"}
            </button>

            <button
              type="button"
              onClick={logout}
              className="w-full rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white hover:bg-red-600"
            >
              Logout
            </button>

          </div>

        </div>

      </aside>
      {/* MOBILE NAVIGATION */}

      <div
        className={`border-b p-4 md:hidden ${
          darkMode
            ? "border-[#242432] bg-[#11111a]"
            : "border-gray-200 bg-white"
        }`}
      >

        <div className="mb-4 flex items-center justify-between">

          <div>

            <h1 className="text-xl font-bold text-purple-600">
              LOOP
            </h1>

            <p
              className={`text-xs ${
                darkMode
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}
            >
              Customer Feedback Intelligence
            </p>

          </div>

          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className={`rounded-lg border px-3 py-2 text-sm ${
              darkMode
                ? "border-[#30303d]"
                : "border-gray-200"
            }`}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

        </div>

        <nav className="grid grid-cols-2 gap-2">

          <a
            href="/dashboard"
            className="rounded-lg px-3 py-2 text-sm hover:bg-purple-50"
          >
            Dashboard
          </a>

          <a
            href="/add-feedback"
            className="rounded-lg px-3 py-2 text-sm hover:bg-purple-50"
          >
            Add Feedback
          </a>

          <a
            href="/feedback-inbox"
            className="rounded-lg px-3 py-2 text-sm hover:bg-purple-50"
          >
            Feedback Inbox
          </a>

          <a
            href="/themes-trends"
            className="rounded-lg bg-purple-100 px-3 py-2 text-sm font-medium text-purple-700"
          >
            Themes & Trends
          </a>

          <a
            href="/ask-loop"
            className="rounded-lg px-3 py-2 text-sm hover:bg-purple-50"
          >
            Ask LOOP
          </a>

          <a
            href="/reports"
            className="rounded-lg px-3 py-2 text-sm hover:bg-purple-50"
          >
            Reports
          </a>

          <a
            href="/csv-upload"
            className="rounded-lg px-3 py-2 text-sm hover:bg-purple-50"
          >
            CSV Upload
          </a>

          <a
            href="/users"
            className="rounded-lg px-3 py-2 text-sm hover:bg-purple-50"
          >
            User Management
          </a>

          <button
            type="button"
            onClick={logout}
            className="col-span-2 rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600"
          >
            Logout
          </button>

        </nav>

      </div>
      {/* MAIN CONTENT */}

      <section className="p-4 sm:p-6 md:ml-64 lg:p-8">

        <div className="mx-auto max-w-6xl">

          {/* HEADER */}

          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="mb-1 text-sm font-medium text-purple-600">
                Customer Insights
              </p>

              <h2 className="text-3xl font-bold tracking-tight">
                Themes & Trends
              </h2>

              <p
                className={`mt-2 ${
                  darkMode
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                Discover the most common themes and trending
                customer issues.
              </p>

            </div>

            <a
              href="/feedback-inbox"
              className="w-fit rounded-xl border border-purple-200 px-5 py-3 text-sm font-semibold text-purple-600 transition hover:bg-purple-50"
            >
              View Feedback
            </a>

          </div>
          {/* OVERVIEW CARDS */}

          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {/* TOP THEME */}

            <div
              className={`rounded-2xl border p-6 ${
                darkMode
                  ? "border-[#242432] bg-[#11111a]"
                  : "border-gray-200 bg-white"
              }`}
            >

              <p
                className={`text-xs font-semibold uppercase tracking-wide ${
                  darkMode
                    ? "text-gray-500"
                    : "text-gray-400"
                }`}
              >
                Top Theme
              </p>

              <h3 className="mt-3 truncate text-2xl font-bold">
                {topTheme
                  ? topTheme.name
                  : "No data"}
              </h3>

              <p className="mt-2 text-sm text-purple-600">
                {topTheme
                  ? `${topTheme.feedback} feedback items`
                  : "No feedback available"}
              </p>

            </div>

            {/* TRENDING */}

            <div
              className={`rounded-2xl border p-6 ${
                darkMode
                  ? "border-[#242432] bg-[#11111a]"
                  : "border-gray-200 bg-white"
              }`}
            >

              <p
                className={`text-xs font-semibold uppercase tracking-wide ${
                  darkMode
                    ? "text-gray-500"
                    : "text-gray-400"
                }`}
              >
                Trending
              </p>

              <h3 className="mt-3 truncate text-2xl font-bold">
                {themes[1]
                  ? themes[1].name
                  : topTheme
                    ? topTheme.name
                    : "No data"}
              </h3>

              <p className="mt-2 text-sm text-green-600">
                Based on feedback volume
              </p>

            </div>

            {/* TOTAL THEMES */}

            <div
              className={`rounded-2xl border p-6 ${
                darkMode
                  ? "border-[#242432] bg-[#11111a]"
                  : "border-gray-200 bg-white"
              }`}
            >

              <p
                className={`text-xs font-semibold uppercase tracking-wide ${
                  darkMode
                    ? "text-gray-500"
                    : "text-gray-400"
                }`}
              >
                Total Themes
              </p>

              <h3 className="mt-3 text-3xl font-bold">
                {totalThemes}
              </h3>

              <p
                className={`mt-2 text-sm ${
                  darkMode
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                Identified from customer feedback
              </p>

            </div>

          </div>
          {/* LOADING STATE */}

          {loading && (
            <div
              className={`rounded-2xl border p-10 text-center ${
                darkMode
                  ? "border-[#242432] bg-[#11111a]"
                  : "border-gray-200 bg-white"
              }`}
            >

              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />

              <p
                className={
                  darkMode
                    ? "text-gray-400"
                    : "text-gray-500"
                }
              >
                Loading themes...
              </p>

            </div>
          )}

          {/* ERROR STATE */}

          {!loading && error && (
            <div
              className={`rounded-2xl border p-8 ${
                darkMode
                  ? "border-red-900 bg-[#11111a]"
                  : "border-red-200 bg-white"
              }`}
            >

              <p className="text-lg font-semibold text-red-500">
                Unable to load themes
              </p>

              <p
                className={`mt-2 text-sm ${
                  darkMode
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                {error}
              </p>

              <button
                type="button"
                onClick={fetchFeedback}
                className="mt-5 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-700"
              >
                Try Again
              </button>

            </div>
          )}

          {/* DATA SECTION */}

          {!loading && !error && (
            <div>{/* TOP THEMES */}

              <div
                className={`rounded-2xl border p-6 ${
                  darkMode
                    ? "border-[#242432] bg-[#11111a]"
                    : "border-gray-200 bg-white"
                }`}
              >

                <div className="mb-6">

                  <h3 className="text-xl font-semibold">
                    Top Themes
                  </h3>

                  <p
                    className={`mt-1 text-sm ${
                      darkMode
                        ? "text-gray-400"
                        : "text-gray-500"
                    }`}
                  >
                    Most common topics identified from customer feedback.
                  </p>

                </div>

                {themes.length === 0 ? (
                  <div className="py-10 text-center">

                    <div className="mb-3 text-4xl">
                      📊
                    </div>

                    <p
                      className={
                        darkMode
                          ? "text-gray-400"
                          : "text-gray-500"
                      }
                    >
                      No themes available yet.
                    </p>

                  </div>
                ) : (
                  <div className="space-y-4">

                    {themes.map((theme, index) => {

                      const percentage =
                        totalFeedback > 0
                          ? Math.round(
                              (theme.feedback /
                                totalFeedback) *
                                100
                            )
                          : 0;

                      return (
                        <div
                          key={theme.name}
                          className={`rounded-xl border p-5 ${
                            darkMode
                              ? "border-[#242432] bg-[#181822]"
                              : "border-gray-100 bg-gray-50"
                          }`}
                        >

                          <div className="flex items-center justify-between gap-4">

                            <div className="min-w-0">

                              <div className="flex items-center gap-3">

                                <span
                                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                                    index === 0
                                      ? "bg-purple-100 text-purple-700"
                                      : darkMode
                                      ? "bg-[#252532] text-gray-400"
                                      : "bg-gray-200 text-gray-500"
                                  }`}
                                >
                                  #{index + 1}
                                </span>

                                <h4 className="truncate text-base font-semibold">
                                  {theme.name}
                                </h4>

                              </div>

                              <p
                                className={`ml-11 mt-2 text-sm ${
                                  darkMode
                                    ? "text-gray-400"
                                    : "text-gray-500"
                                }`}
                              >
                                {theme.feedback} feedback items
                              </p>

                            </div>

                            <div className="shrink-0 text-right">

                              <p className="text-lg font-bold text-purple-600">
                                {percentage}%
                              </p>

                              <p
                                className={`text-xs ${
                                  darkMode
                                    ? "text-gray-500"
                                    : "text-gray-400"
                                }`}
                              >
                                of feedback
                              </p>

                            </div>

                          </div>

                          {/* PROGRESS BAR */}

                          <div
                            className={`ml-11 mt-4 h-2 overflow-hidden rounded-full ${
                              darkMode
                                ? "bg-[#2a2a38]"
                                : "bg-gray-200"
                            }`}
                          >

                            <div
                              className="h-full rounded-full bg-purple-600 transition-all duration-500"
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

              </div></div>
          )}

        </div>

      </section>

    </main>
  );
}

