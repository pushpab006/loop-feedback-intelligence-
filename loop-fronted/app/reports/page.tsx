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

useEffect(() => {
const fetchFeedback = async () => {
try {
const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login again.");
      return;
    }

    const response = await fetch(
      "http://localhost:5000/api/feedback",
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

const analyzedFeedback = feedbacks.filter(
(item) => item.sentiment
);

const positive = feedbacks.filter(
(item) => item.sentiment === "POSITIVE"
).length;

const negative = feedbacks.filter(
(item) => item.sentiment === "NEGATIVE"
).length;

const positivePercentage =
feedbacks.length > 0
? Math.round((positive / feedbacks.length) * 100)
: 0;

const negativePercentage =
feedbacks.length > 0
? Math.round((negative / feedbacks.length) * 100)
: 0;

// Count themes
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
.slice(0, 3);

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
        className="block px-4 py-3 text-slate-400 hover:bg-slate-800 rounded-lg"
      >
        Dashboard
      </a>

      <a
        href="/add-feedback"
        className="block px-4 py-3 text-slate-400 hover:bg-slate-800 rounded-lg"
      >
        Add Feedback
      </a>

      <a
        href="/feedback-inbox"
        className="block px-4 py-3 text-slate-400 hover:bg-slate-800 rounded-lg"
      >
        Feedback Inbox
      </a>

      <a
        href="/csv-upload"
        className="block px-4 py-3 text-slate-400 hover:bg-slate-800 rounded-lg"
      >
        CSV Upload
      </a>

      <a
        href="/themes-trends"
        className="block px-4 py-3 text-slate-400 hover:bg-slate-800 rounded-lg"
      >
        Themes & Trends
      </a>

      <a
        href="/ask-loop"
        className="block px-4 py-3 text-slate-400 hover:bg-slate-800 rounded-lg"
      >
        Ask LOOP
      </a>

      <a
        href="/reports"
        className="block bg-blue-600 rounded-lg px-4 py-3"
      >
        Reports
      </a>

    </nav>
  </aside>

  {/* Main */}
  <section className="flex-1 p-6 md:p-10">

    <div className="max-w-6xl mx-auto">

      <h2 className="text-3xl font-bold">
        Voice of Customer Report
      </h2>

      <p className="text-slate-400 mt-2 mb-8">
        AI-powered summary of customer feedback.
      </p>

      {loading && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
          <p className="text-slate-400">
            Loading report...
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

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <p className="text-slate-500 text-sm">
                FEEDBACK ANALYZED
              </p>

              <h3 className="text-3xl font-bold mt-2">
                {analyzedFeedback.length}
              </h3>

              <p className="text-slate-400 text-sm mt-2">
                Total feedback with AI analysis
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <p className="text-slate-500 text-sm">
                POSITIVE
              </p>

              <h3 className="text-3xl font-bold mt-2 text-green-400">
                {positivePercentage}%
              </h3>

              <p className="text-slate-400 text-sm mt-2">
                {positive} positive feedback
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <p className="text-slate-500 text-sm">
                NEGATIVE
              </p>

              <h3 className="text-3xl font-bold mt-2 text-red-400">
                {negativePercentage}%
              </h3>

              <p className="text-slate-400 text-sm mt-2">
                {negative} negative feedback
              </p>
            </div>

          </div>

          {/* Top Themes */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">

            <h3 className="text-xl font-semibold mb-5">
              Top Customer Themes
            </h3>

            {topThemes.length === 0 ? (

              <p className="text-slate-400">
                No themes available yet.
              </p>

            ) : (

              <div className="space-y-4">

                {topThemes.map((theme, index) => (

                  <div
                    key={theme.name}
                    className="bg-slate-800 rounded-lg p-4"
                  >

                    <div className="flex justify-between items-center">

                      <p className="font-semibold">
                        {index + 1}. {theme.name}
                      </p>

                      <span className="text-blue-400">
                        {theme.count} feedback
                      </span>

                    </div>

                    <p className="text-slate-400 text-sm mt-2">
                      This is one of the most common areas mentioned by customers.
                    </p>

                  </div>

                ))}

              </div>

            )}

          </div>

          {/* Recommendations */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">

            <h3 className="text-xl font-semibold mb-5">
              Recommended Actions
            </h3>

            {topThemes.length === 0 ? (

              <p className="text-slate-400">
                Add more feedback to generate recommendations.
              </p>

            ) : (

              <ol className="space-y-4 text-slate-300">

                {topThemes.map((theme, index) => (

                  <li key={theme.name}>
                    {index + 1}. Review customer feedback related to{" "}
                    <span className="text-blue-400 font-semibold">
                      {theme.name}
                    </span>{" "}
                    and identify possible improvements.
                  </li>

                ))}

              </ol>

            )}

          </div>

        </>
      )}

    </div>

  </section>

</main>

);
}