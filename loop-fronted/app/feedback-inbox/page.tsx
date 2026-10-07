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

export default function FeedbackInbox() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState("ALL");
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
    } catch (error) {
      console.error(error);
      setError("Cannot connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const updateStatus = async (
    id: number,
    status: string
  ) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login again.");
        return;
      }

      const response = await fetch(
        `https://loop-feedback-intelligence.onrender.com/api/feedback/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: status,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to update status (${response.status})`
        );
      }

      setFeedbacks((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                status: status,
              }
            : item
        )
      );
    } catch (error) {
      console.error(
        "Status update error:",
        error
      );

      alert("Failed to update status.");
    }
  };

  const filteredFeedbacks = feedbacks.filter(
    (item) => {
      const matchesSearch = item.feedback
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesSentiment =
        sentimentFilter === "ALL" ||
        item.sentiment === sentimentFilter;

      return (
        matchesSearch &&
        matchesSentiment
      );
    }
  );

  const totalFeedback = feedbacks.length;

  const positiveCount = feedbacks.filter(
    (item) => item.sentiment === "POSITIVE"
  ).length;

  const negativeCount = feedbacks.filter(
    (item) => item.sentiment === "NEGATIVE"
  ).length;

  const neutralCount = feedbacks.filter(
    (item) => item.sentiment === "NEUTRAL"
  ).length;

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("loopUser");
    window.location.href = "/login";
  }

  return (
    <main
      className={`min-h-screen transition-colors duration-300 ${darkMode
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
              className="block rounded-xl bg-purple-100 px-4 py-3 text-sm font-semibold text-purple-700"
            >
              Feedback Inbox
            </a>

            <a
              href="/themes-trends"
              className="block rounded-xl px-4 py-3 text-sm font-medium hover:bg-purple-50"
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
              onClick={() =>
                setDarkMode(!darkMode)
              }
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
            onClick={() =>
              setDarkMode(!darkMode)
            }
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
            className="rounded-lg bg-purple-100 px-3 py-2 text-sm font-medium text-purple-700"
          >
            Feedback Inbox
          </a>

          <a
            href="/themes-trends"
            className="rounded-lg px-3 py-2 text-sm hover:bg-purple-50"
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
                Feedback Inbox
              </h2>

              <p
                className={`mt-2 ${
                  darkMode
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                View, search and manage customer feedback.
              </p>

            </div>

            <a
              href="/add-feedback"
              className="w-fit rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
            >
              + Add Feedback
            </a>

          </div>

          {/* SUMMARY CARDS */}

          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {/* TOTAL */}

            <div
              className={`rounded-2xl border p-5 ${
                darkMode
                  ? "border-[#242432] bg-[#11111a]"
                  : "border-gray-200 bg-white"
              }`}
            >
              <p
                className={`text-sm ${
                  darkMode
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                Total Feedback
              </p>

              <p className="mt-2 text-3xl font-bold">
                {totalFeedback}
              </p>

              <p className="mt-1 text-xs text-purple-600">
                All customer responses
              </p>
            </div>

            {/* POSITIVE */}

            <div
              className={`rounded-2xl border p-5 ${
                darkMode
                  ? "border-[#242432] bg-[#11111a]"
                  : "border-gray-200 bg-white"
              }`}
            >
              <p
                className={`text-sm ${
                  darkMode
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                Positive
              </p>

              <p className="mt-2 text-3xl font-bold text-green-600">
                {positiveCount}
              </p>

              <p className="mt-1 text-xs text-green-600">
                Satisfied customers
              </p>
            </div>

            {/* NEGATIVE */}

            <div
              className={`rounded-2xl border p-5 ${
                darkMode
                  ? "border-[#242432] bg-[#11111a]"
                  : "border-gray-200 bg-white"
              }`}
            >
              <p
                className={`text-sm ${
                  darkMode
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                Negative
              </p>

              <p className="mt-2 text-3xl font-bold text-red-500">
                {negativeCount}
              </p>

              <p className="mt-1 text-xs text-red-500">
                Needs attention
              </p>
            </div>

            {/* NEUTRAL */}

            <div
              className={`rounded-2xl border p-5 ${
                darkMode
                  ? "border-[#242432] bg-[#11111a]"
                  : "border-gray-200 bg-white"
              }`}
            >
              <p
                className={`text-sm ${
                  darkMode
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                Neutral
              </p>

              <p className="mt-2 text-3xl font-bold text-yellow-500">
                {neutralCount}
              </p>

              <p className="mt-1 text-xs text-yellow-500">
                Mixed or neutral feedback
              </p>
            </div>

          </div>

          {/* FILTERS */}

          <div
            className={`mb-8 rounded-2xl border p-4 ${
              darkMode
                ? "border-[#242432] bg-[#11111a]"
                : "border-gray-200 bg-white"
            }`}
          >

            <div className="flex flex-col gap-4 md:flex-row">

              {/* SEARCH */}

              <div className="flex-1">

                <label
                  className={`mb-2 block text-sm font-medium ${
                    darkMode
                      ? "text-gray-300"
                      : "text-gray-700"
                  }`}
                >
                  Search Feedback
                </label>

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search customer feedback..."
                  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-purple-500 ${
                    darkMode
                      ? "border-[#30303d] bg-[#181822] text-white placeholder-gray-500"
                      : "border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400"
                  }`}
                />

              </div>

              {/* SENTIMENT */}

              <div className="w-full md:w-56">

                <label
                  className={`mb-2 block text-sm font-medium ${
                    darkMode
                      ? "text-gray-300"
                      : "text-gray-700"
                  }`}
                >
                  Sentiment
                </label>

                <select
                  value={sentimentFilter}
                  onChange={(e) =>
                    setSentimentFilter(e.target.value)
                  }
                  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-purple-500 ${
                    darkMode
                      ? "border-[#30303d] bg-[#181822] text-white"
                      : "border-gray-200 bg-gray-50 text-gray-900"
                  }`}
                >
                  <option value="ALL">
                    All Sentiments
                  </option>

                  <option value="POSITIVE">
                    Positive
                  </option>

                  <option value="NEGATIVE">
                    Negative
                  </option>

                  <option value="NEUTRAL">
                    Neutral
                  </option>
                </select>

              </div>

            </div>

          </div>

          {/* FEEDBACK CONTENT */}

          {loading ? (

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
                Loading feedback...
              </p>
            </div>

          ) : error ? (

            <div
              className={`rounded-2xl border p-8 text-center ${
                darkMode
                  ? "border-red-900 bg-[#11111a]"
                  : "border-red-200 bg-white"
              }`}
            >
              <p className="mb-2 text-lg font-semibold text-red-500">
                Unable to load feedback
              </p>

              <p
                className={
                  darkMode
                    ? "text-gray-400"
                    : "text-gray-500"
                }
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

          ) : filteredFeedbacks.length === 0 ? (

            <div
              className={`rounded-2xl border p-10 text-center ${
                darkMode
                  ? "border-[#242432] bg-[#11111a]"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="mb-4 text-4xl">
                📭
              </div>

              <h3 className="text-lg font-semibold">
                No feedback found
              </h3>

              <p
                className={`mt-2 text-sm ${
                  darkMode
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                Try changing your search or sentiment filter.
              </p>
            </div>

          ) : (
            <div className="space-y-4">

              {filteredFeedbacks.map((item) => (

                <div
                  key={item.id}
                  className={`rounded-2xl border p-5 transition hover:shadow-sm ${
                    darkMode
                      ? "border-[#242432] bg-[#11111a]"
                      : "border-gray-200 bg-white"
                  }`}
                >

                  {/* TOP ROW */}

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                    <div className="flex-1">

                      <div className="mb-3 flex flex-wrap items-center gap-2">

                        {/* SENTIMENT */}

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            item.sentiment === "POSITIVE"
                              ? "bg-green-100 text-green-700"
                              : item.sentiment === "NEGATIVE"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {item.sentiment || "UNKNOWN"}
                        </span>

                        {/* FEATURE AREA */}

                        {item.featureArea && (
                          <span
                            className={`rounded-full px-3 py-1 text-xs ${
                              darkMode
                                ? "bg-[#20202c] text-gray-300"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {item.featureArea}
                          </span>
                        )}

                      </div>

                      {/* FEEDBACK TEXT */}

                      <p
                        className={`text-sm leading-6 ${
                          darkMode
                            ? "text-gray-200"
                            : "text-gray-700"
                        }`}
                      >
                        {item.feedback}
                      </p>

                    </div>

                    {/* SCORE */}

                    <div className="sm:text-right">

                      <p
                        className={`text-xs ${
                          darkMode
                            ? "text-gray-500"
                            : "text-gray-400"
                        }`}
                      >
                        AI Score
                      </p>

                      <p className="mt-1 text-xl font-bold text-purple-600">
                        {item.score ?? "—"}
                      </p>

                    </div>

                  </div>

                  {/* BOTTOM ROW */}

                  <div
                    className={`mt-5 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between ${
                      darkMode
                        ? "border-[#242432]"
                        : "border-gray-100"
                    }`}
                  >

                    <div className="text-xs text-gray-500">
                      {new Date(
                        item.createdAt
                      ).toLocaleString()}
                    </div>

                    {/* STATUS */}

                    <select
                      value={item.status}
                      onChange={(e) =>
                        updateStatus(
                          item.id,
                          e.target.value
                        )
                      }
                      className={`rounded-lg border px-3 py-2 text-sm outline-none focus:border-purple-500 ${
                        darkMode
                          ? "border-[#30303d] bg-[#181822] text-white"
                          : "border-gray-200 bg-gray-50 text-gray-700"
                      }`}
                    >
                      <option value="NEW">
                        New
                      </option>

                      <option value="REVIEWED">
                        Reviewed
                      </option>

                      <option value="RESOLVED">
                        Resolved
                      </option>
                    </select>

                  </div>

                </div>

              ))}

            </div>

            )}

        </div>

      </section>

    </main>
  );
}