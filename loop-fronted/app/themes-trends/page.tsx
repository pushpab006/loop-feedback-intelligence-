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

const themeCounts: { [key: string]: number } = {};

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

return (
<main className="min-h-screen bg-slate-950 text-white flex">

  {/* Sidebar */}
  <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 hidden md:block">

    <h1 className="text-3xl font-bold text-blue-500 mb-10">
      LOOP
    </h1>

    <nav className="space-y-3">

      <a
        href="/"
        className="block px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg"
      >
        Dashboard
      </a>

      <a
        href="/add-feedback"
        className="block px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg"
      >
        Add Feedback
      </a>

      <a
        href="/feedback-inbox"
        className="block px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg"
      >
        Feedback Inbox
      </a>

      <a
        href="/csv-upload"
        className="block px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg"
      >
        CSV Upload
      </a>

      <a
        href="/themes-trends"
        className="block bg-blue-600 rounded-lg px-4 py-3"
      >
        Themes & Trends
      </a>

      <a
        href="/ask-loop"
        className="block px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg"
      >
        Ask LOOP
      </a>

      <a
        href="/reports"
        className="block px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg"
      >
        Reports
      </a>

    </nav>
  </aside>

  {/* Main Content */}
  <section className="flex-1 p-6 md:p-10">

    <div className="max-w-6xl mx-auto">

      <div className="mb-8">

        <h2 className="text-3xl font-bold">
          Themes & Trends
        </h2>

        <p className="text-slate-400 mt-2">
          Discover the most common themes and trending
          customer issues.
        </p>

      </div>

      {loading && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
          <p className="text-slate-400">
            Loading themes...
          </p>
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-900/30 border border-red-800 rounded-xl p-6">
          <p className="text-red-300">
            {error}
          </p>
        </div>
      )}

      {!loading && !error && (
        <>

          {/* Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">

              <p className="text-slate-500 text-sm">
                TOP THEME
              </p>

              <h3 className="text-2xl font-bold mt-2">
                {topTheme
                  ? topTheme.name
                  : "No data"}
              </h3>

              <p className="text-blue-400 mt-2">
                {topTheme
                  ? `${topTheme.feedback} feedback items`
                  : "No feedback available"}
              </p>

            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">

              <p className="text-slate-500 text-sm">
                TRENDING
              </p>

              <h3 className="text-2xl font-bold mt-2">
                {themes[1]
                  ? themes[1].name
                  : topTheme
                    ? topTheme.name
                    : "No data"}
              </h3>

              <p className="text-green-400 mt-2">
                Based on feedback volume
              </p>

            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">

              <p className="text-slate-500 text-sm">
                TOTAL THEMES
              </p>

              <h3 className="text-2xl font-bold mt-2">
                {totalThemes}
              </h3>

              <p className="text-slate-400 mt-2">
                Identified from customer feedback
              </p>

            </div>

          </div>

          {/* Top Themes */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">

            <h3 className="text-xl font-semibold mb-6">
              Top Themes
            </h3>

            {themes.length === 0 ? (

              <p className="text-slate-400">
                No themes available yet.
              </p>

            ) : (

              <div className="space-y-4">

                {themes.map((theme, index) => {

                  const percentage =
                    feedbacks.length > 0
                      ? Math.round(
                          (theme.feedback /
                            feedbacks.length) *
                            100
                        )
                      : 0;

                  return (
                    <div
                      key={theme.name}
                      className="bg-slate-800 rounded-xl p-5"
                    >

                      <div className="flex items-center justify-between">

                        <div>

                          <div className="flex items-center gap-3">

                            <span className="text-slate-500">
                              #{index + 1}
                            </span>

                            <h4 className="text-lg font-semibold">
                              {theme.name}
                            </h4>

                          </div>

                          <p className="text-slate-400 mt-1 ml-7">
                            {theme.feedback} feedback items
                          </p>

                        </div>

                        <div className="text-blue-400 font-semibold">
                          {percentage}%
                        </div>

                      </div>

                      {/* Progress bar */}
                      <div className="mt-4 ml-7 h-2 bg-slate-700 rounded-full overflow-hidden">

                        <div
                          className="h-full bg-blue-600 rounded-full"
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

        </>
      )}

    </div>

  </section>

</main>

);
}