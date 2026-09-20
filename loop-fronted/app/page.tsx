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

        console.log("Dashboard feedback response:", data);

        if (!response.ok) {
          console.error("Failed to fetch feedback:", data);
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
        console.error("Dashboard error:", error);
        setFeedbacks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  const totalFeedback = feedbacks.length;

  const positive = feedbacks.filter(
    (item) => item.sentiment === "POSITIVE"
  ).length;

  const negative = feedbacks.filter(
    (item) => item.sentiment === "NEGATIVE"
  ).length;

  const neutral = feedbacks.filter(
    (item) => item.sentiment === "NEUTRAL"
  ).length;

  const sentimentData = [
    { name: "Positive", value: positive },
    { name: "Negative", value: negative },
    { name: "Neutral", value: neutral },
  ];

  const themeCount: Record<string, number> = {};

  feedbacks.forEach((item) => {
    const theme = item.featureArea || "Other";

    themeCount[theme] = (themeCount[theme] || 0) + 1;
  });

  const topThemes = Object.entries(themeCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, value]) => ({
      name,
      value,
    }));

  const volumeMap: Record<string, number> = {};

  feedbacks.forEach((item) => {
    const date = new Date(
      item.createdAt
    ).toLocaleDateString();

    volumeMap[date] =
      (volumeMap[date] || 0) + 1;
  });

  const volumeData = Object.entries(volumeMap).map(
    ([date, count]) => ({
      date,
      count,
    })
  );

  const recentFeedback = [...feedbacks]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("loopUser");
    window.location.href = "/login";
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600">
          Loading dashboard...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">

      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r bg-white p-6 md:flex">
        <h1 className="text-2xl font-bold text-indigo-600">
          LOOP
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Customer Feedback Intelligence
        </p>

        <nav className="mt-8 space-y-2">

          <a
            href="/"
            className="block rounded-lg bg-indigo-50 px-4 py-3 font-medium text-indigo-600"
          >
            Dashboard
          </a>

          <a
            href="/add-feedback"
            className="block rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100"
          >
            Add Feedback
          </a>

          <a
            href="/feedback-inbox"
            className="block rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100"
          >
            Feedback Inbox
          </a>

          <a
            href="/themes-trends"
            className="block rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100"
          >
            Themes & Trends
          </a>

          <a
            href="/ask-loop"
            className="block rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100"
          >
            Ask LOOP
          </a>

          <a
            href="/reports"
            className="block rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100"
          >
            Reports
          </a>

          <a
            href="/csv-upload"
            className="block rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100"
          >
            CSV Upload
          </a>

          <a
            href="/users"
            className="block rounded-lg px-4 py-3 font-medium text-gray-800 hover:bg-gray-100"
          >
            User Management
          </a>
        </nav>

        <button
          onClick={logout}
          className="mt-10 w-full rounded-lg bg-red-600 px-4 py-3 font-medium text-white hover:bg-red-700"
        >
          Logout
        </button>
      </aside>


      {/* ================= MOBILE NAVIGATION ================= */}
      <div className="border-b bg-white p-4 md:hidden">

        <div className="mb-4">
          <h1 className="text-2xl font-bold text-indigo-600">
            LOOP
          </h1>

          <p className="text-xs text-gray-500">
            Customer Feedback Intelligence
          </p>
        </div>

        <nav className="grid grid-cols-2 gap-2">

          <a
            href="/"
            className="rounded-lg bg-indigo-50 px-3 py-3 text-sm font-medium text-indigo-600"
          >
            Dashboard
          </a>

          <a
            href="/add-feedback"
            className="rounded-lg px-3 py-3 text-sm text-gray-700 hover:bg-gray-100"
          >
            Add Feedback
          </a>

          <a
            href="/feedback-inbox"
            className="rounded-lg px-3 py-3 text-sm text-gray-700 hover:bg-gray-100"
          >
            Feedback Inbox
          </a>

          <a
            href="/themes-trends"
            className="rounded-lg px-3 py-3 text-sm text-gray-700 hover:bg-gray-100"
          >
            Themes & Trends
          </a>

          <a
            href="/ask-loop"
            className="rounded-lg px-3 py-3 text-sm text-gray-700 hover:bg-gray-100"
          >
            Ask LOOP
          </a>

          <a
            href="/reports"
            className="rounded-lg px-3 py-3 text-sm text-gray-700 hover:bg-gray-100"
          >
            Reports
          </a>

          <a
            href="/csv-upload"
            className="rounded-lg px-3 py-3 text-sm text-gray-700 hover:bg-gray-100"
          >
            CSV Upload
          </a>

          <a
            href="/users"
            className="rounded-lg px-3 py-3 text-sm font-medium text-gray-800 hover:bg-gray-100"
          >
            User Management
          </a>

          <button
            onClick={logout}
            className="col-span-2 rounded-lg bg-red-600 px-3 py-3 text-sm font-medium text-white hover:bg-red-700"
          >
            Logout
          </button>

        </nav>
      </div>


      {/* ================= MAIN CONTENT ================= */}
      <section className="p-4 sm:p-6 lg:p-8 md:ml-64">

        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Dashboard
            </h2>

            <p className="mt-1 text-gray-500">
              Monitor customer feedback and AI insights.
            </p>
          </div>


          {/* ================= STATS ================= */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">
                Total Feedback
              </p>

              <h3 className="mt-2 text-3xl font-bold text-gray-900">
                {totalFeedback}
              </h3>
            </div>


            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">
                Positive
              </p>

              <h3 className="mt-2 text-3xl font-bold text-green-600">
                {positive}
              </h3>
            </div>


            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">
                Negative
              </p>

              <h3 className="mt-2 text-3xl font-bold text-red-600">
                {negative}
              </h3>
            </div>


            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">
                Neutral
              </p>

              <h3 className="mt-2 text-3xl font-bold text-gray-600">
                {neutral}
              </h3>
            </div>

          </div>


          {/* ================= CHARTS ================= */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">

            {/* Sentiment Chart */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">

              <h3 className="text-lg font-semibold text-gray-900">
                Sentiment Overview
              </h3>

              {totalFeedback === 0 ? (
                <div className="flex h-72 items-center justify-center text-gray-500">
                  No feedback available
                </div>
              ) : (
                <div className="h-72">

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <PieChart>

                      <Pie
                        data={sentimentData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        label
                      >
                        {sentimentData.map(
                          (entry, index) => (
                            <Cell key={index} />
                          )
                        )}
                      </Pie>

                      <Tooltip />

                    </PieChart>
                  </ResponsiveContainer>

                </div>
              )}

            </div>


            {/* Volume Chart */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">

              <h3 className="text-lg font-semibold text-gray-900">
                Feedback Volume
              </h3>

              {volumeData.length === 0 ? (
                <div className="flex h-72 items-center justify-center text-gray-500">
                  No feedback available
                </div>
              ) : (
                <div className="h-72">

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <LineChart data={volumeData}>

                      <CartesianGrid strokeDasharray="3 3" />

                      <XAxis dataKey="date" />

                      <YAxis />

                      <Tooltip />

                      <Line
                        type="monotone"
                        dataKey="count"
                        strokeWidth={3}
                      />

                    </LineChart>

                  </ResponsiveContainer>

                </div>
              )}

            </div>

          </div>


          {/* ================= TOP THEMES ================= */}
          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

            <h3 className="text-lg font-semibold text-gray-900">
              Top Themes
            </h3>

            {topThemes.length === 0 ? (
              <div className="flex h-64 items-center justify-center text-gray-500">
                No themes available
              </div>
            ) : (
              <div className="mt-4 h-64">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <BarChart data={topThemes}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="name" />

                    <YAxis />

                    <Tooltip />

                    <Bar dataKey="value" />

                  </BarChart>

                </ResponsiveContainer>

              </div>
            )}

          </div>


          {/* ================= RECENT FEEDBACK ================= */}
          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

              <h3 className="text-lg font-semibold text-gray-900">
                Recent Feedback
              </h3>

              <a
                href="/feedback-inbox"
                className="text-sm font-medium text-indigo-600 hover:underline"
              >
                View all
              </a>

            </div>


            {recentFeedback.length === 0 ? (
              <p className="mt-6 text-gray-500">
                No feedback available yet.
              </p>
            ) : (

              <div className="mt-4 space-y-3">

                {recentFeedback.map((item) => (

                  <div
                    key={item.id}
                    className="rounded-xl border p-4"
                  >

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                      <p className="break-words text-gray-800">
                        {item.feedback}
                      </p>

                      <span
                        className={`w-fit shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                          item.sentiment === "POSITIVE"
                            ? "bg-green-100 text-green-700"
                            : item.sentiment === "NEGATIVE"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {item.sentiment || "UNKNOWN"}
                      </span>

                    </div>


                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">

                      <span>
                        Score: {item.score ?? "-"}
                      </span>

                      <span>
                        Area: {item.featureArea || "Other"}
                      </span>

                      <span>
                        Status: {item.status}
                      </span>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>

      </section>

    </main>
  );
}