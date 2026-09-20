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

  const fetchFeedback = async () => {
    try {
      setLoading(true);

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
        `http://localhost:5000/api/feedback/${id}/status`,
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

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("loopUser");
    window.location.href = "/login";
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-slate-800 bg-slate-900 p-6 md:flex">

        <h1 className="mb-2 text-2xl font-bold text-blue-400">
          LOOP
        </h1>

        <p className="mb-8 text-xs text-slate-500">
          Customer Feedback Intelligence
        </p>

        <nav className="space-y-2">

          <a
            href="/"
            className="block rounded-lg px-4 py-3 hover:bg-slate-800"
          >
            Dashboard
          </a>

          <a
            href="/add-feedback"
            className="block rounded-lg px-4 py-3 hover:bg-slate-800"
          >
            Add Feedback
          </a>

          <a
            href="/feedback-inbox"
            className="block rounded-lg bg-slate-800 px-4 py-3 text-blue-400"
          >
            Feedback Inbox
          </a>

          <a
            href="/themes-trends"
            className="block rounded-lg px-4 py-3 hover:bg-slate-800"
          >
            Themes & Trends
          </a>

          <a
            href="/ask-loop"
            className="block rounded-lg px-4 py-3 hover:bg-slate-800"
          >
            Ask LOOP
          </a>

          <a
            href="/reports"
            className="block rounded-lg px-4 py-3 hover:bg-slate-800"
          >
            Reports
          </a>

          <a
            href="/csv-upload"
            className="block rounded-lg px-4 py-3 hover:bg-slate-800"
          >
            CSV Upload
          </a>

          <a
            href="/users"
            className="block rounded-lg px-4 py-3 hover:bg-slate-800"
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
      <div className="border-b border-slate-800 bg-slate-900 p-4 md:hidden">

        <div className="mb-4">
          <h1 className="text-2xl font-bold text-blue-400">
            LOOP
          </h1>

          <p className="text-xs text-slate-500">
            Customer Feedback Intelligence
          </p>
        </div>

        <nav className="grid grid-cols-2 gap-2">

          <a
            href="/"
            className="rounded-lg px-3 py-3 text-sm hover:bg-slate-800"
          >
            Dashboard
          </a>

          <a
            href="/add-feedback"
            className="rounded-lg px-3 py-3 text-sm hover:bg-slate-800"
          >
            Add Feedback
          </a>

          <a
            href="/feedback-inbox"
            className="rounded-lg bg-slate-800 px-3 py-3 text-sm text-blue-400"
          >
            Feedback Inbox
          </a>

          <a
            href="/themes-trends"
            className="rounded-lg px-3 py-3 text-sm hover:bg-slate-800"
          >
            Themes & Trends
          </a>

          <a
            href="/ask-loop"
            className="rounded-lg px-3 py-3 text-sm hover:bg-slate-800"
          >
            Ask LOOP
          </a>

          <a
            href="/reports"
            className="rounded-lg px-3 py-3 text-sm hover:bg-slate-800"
          >
            Reports
          </a>

          <a
            href="/csv-upload"
            className="rounded-lg px-3 py-3 text-sm hover:bg-slate-800"
          >
            CSV Upload
          </a>

          <a
            href="/users"
            className="rounded-lg px-3 py-3 text-sm hover:bg-slate-800"
          >
            User Management
          </a>

          <button
            onClick={logout}
            className="col-span-2 rounded-lg bg-red-600 px-3 py-3 text-sm font-medium hover:bg-red-700"
          >
            Logout
          </button>

        </nav>

      </div>


      {/* ================= MAIN CONTENT ================= */}
      <section className="p-4 sm:p-6 md:ml-64 lg:p-8">

        <div className="mx-auto max-w-6xl">

          {/* Header */}
          <div className="mb-8">

            <h2 className="text-2xl font-bold sm:text-3xl">
              Feedback Inbox
            </h2>

            <p className="mt-2 text-sm text-slate-400 sm:text-base">
              View and manage customer feedback.
            </p>

          </div>


          {/* ================= FILTERS ================= */}
          <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-5">

            <div className="flex flex-col gap-4 md:flex-row">

              <input
                type="text"
                placeholder="Search feedback..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
              />

              <select
                value={sentimentFilter}
                onChange={(e) =>
                  setSentimentFilter(
                    e.target.value
                  )
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none md:w-56"
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


          {/* ================= LOADING ================= */}
          {loading && (
            <div className="rounded-2xl bg-slate-900 p-8 text-center text-slate-400">
              Loading feedback...
            </div>
          )}


          {/* ================= ERROR ================= */}
          {!loading && error && (
            <div className="rounded-2xl border border-red-800 bg-red-900/30 p-6 text-red-300">
              {error}
            </div>
          )}


          {/* ================= NO RESULTS ================= */}
          {!loading &&
            !error &&
            filteredFeedbacks.length === 0 && (
              <div className="rounded-2xl bg-slate-900 p-8 text-center text-slate-400">
                No feedback found.
              </div>
            )}


          {/* ================= FEEDBACK CARDS ================= */}
          <div className="space-y-5">

            {!loading &&
              filteredFeedbacks.map((item) => (

                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-6"
                >

                  <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">

                    {/* Feedback */}
                    <div className="min-w-0 flex-1">

                      <p className="break-words text-base leading-relaxed text-white sm:text-lg">
                        "{item.feedback}"
                      </p>


                      {/* AI INFORMATION */}
                      <div className="mt-5 flex flex-wrap gap-2 sm:gap-3">

                        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs sm:text-sm">
                          {item.sentiment ||
                            "Not analyzed"}
                        </span>

                        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs sm:text-sm">
                          Score:{" "}
                          {item.score ?? "N/A"}
                        </span>

                        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs sm:text-sm">
                          {item.featureArea ||
                            "Other"}
                        </span>

                      </div>


                      <p className="mt-4 break-words text-xs text-slate-500">
                        {new Date(
                          item.createdAt
                        ).toLocaleString()}
                      </p>

                    </div>


                    {/* STATUS */}
                    <div className="w-full lg:w-48">

                      <p className="mb-2 text-sm text-slate-500">
                        STATUS
                      </p>

                      <select
                        value={
                          item.status || "NEW"
                        }
                        onChange={(e) =>
                          updateStatus(
                            item.id,
                            e.target.value
                          )
                        }
                        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-3 text-white outline-none focus:border-blue-500"
                      >

                        <option value="NEW">
                          NEW
                        </option>

                        <option value="REVIEWED">
                          REVIEWED
                        </option>

                        <option value="ACTIONED">
                          ACTIONED
                        </option>

                      </select>

                    </div>

                  </div>

                </div>

              ))}

          </div>

        </div>

      </section>

    </main>
  );
}