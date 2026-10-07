"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

export default function AskLoop() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load saved theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("loop-theme");

    if (savedTheme === "dark") {
      setDarkMode(true);
    }
  }, []);

  // Save theme
  useEffect(() => {
    localStorage.setItem(
      "loop-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  // Ask LOOP
  const handleAsk = async () => {
    if (!question.trim()) {
      return;
    }

    setLoading(true);
    setAnswer("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setAnswer("Please login again.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        "https://loop-feedback-intelligence.onrender.com/api/ask-loop",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            question: question,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setAnswer(
          data.answer || "LOOP did not return an answer."
        );
      } else {
        setAnswer(
          data.message || "Something went wrong."
        );
      }
    } catch (error) {
      console.error(error);
      setAnswer("Cannot connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  // Logout
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("loopUser");

    window.location.href = "/login";
  }

  // Example question
  function selectQuestion(text: string) {
    setQuestion(text);
    setAnswer("");
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
              className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                darkMode
                  ? "text-gray-300 hover:bg-[#1d1d29]"
                  : "text-gray-700 hover:bg-purple-50"
              }`}
            >
              Dashboard
            </a>

            <a
              href="/add-feedback"
              className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                darkMode
                  ? "text-gray-300 hover:bg-[#1d1d29]"
                  : "text-gray-700 hover:bg-purple-50"
              }`}
            >
              Add Feedback
            </a>

            <a
              href="/feedback-inbox"
              className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                darkMode
                  ? "text-gray-300 hover:bg-[#1d1d29]"
                  : "text-gray-700 hover:bg-purple-50"
              }`}
            >
              Feedback Inbox
            </a>

            <a
              href="/themes-trends"
              className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                darkMode
                  ? "text-gray-300 hover:bg-[#1d1d29]"
                  : "text-gray-700 hover:bg-purple-50"
              }`}
            >
              Themes & Trends
            </a>

            <a
              href="/ask-loop"
              className="block rounded-xl bg-purple-100 px-4 py-3 text-sm font-semibold text-purple-700"
            >
              Ask LOOP
            </a>

            <a
              href="/reports"
              className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                darkMode
                  ? "text-gray-300 hover:bg-[#1d1d29]"
                  : "text-gray-700 hover:bg-purple-50"
              }`}
            >
              Reports
            </a>

            <a
              href="/csv-upload"
              className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                darkMode
                  ? "text-gray-300 hover:bg-[#1d1d29]"
                  : "text-gray-700 hover:bg-purple-50"
              }`}
            >
              CSV Upload
            </a>

            <a
              href="/users"
              className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                darkMode
                  ? "text-gray-300 hover:bg-[#1d1d29]"
                  : "text-gray-700 hover:bg-purple-50"
              }`}
            >
              User Management
            </a>

          </nav>

          {/* BOTTOM BUTTONS */}

          <div className="mt-auto">

            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className={`mb-3 w-full rounded-xl border px-4 py-3 text-sm transition ${
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
              className="w-full rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
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
            className="rounded-lg px-3 py-2 text-sm hover:bg-purple-50"
          >
            Themes & Trends
          </a>

          <a
            href="/ask-loop"
            className="rounded-lg bg-purple-100 px-3 py-2 text-sm font-medium text-purple-700"
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

        <div className="mx-auto max-w-5xl">

          {/* HEADER */}

          <div className="mb-8">

            <p className="mb-1 text-sm font-medium text-purple-600">
              AI Customer Insights
            </p>

            <h2 className="text-3xl font-bold tracking-tight">
              Ask LOOP
            </h2>

            <p
              className={`mt-2 ${
                darkMode
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}
            >
              Ask questions about your customer feedback
              and get AI-powered insights.
            </p>

          </div>


          {/* QUESTION BOX */}

          <div
            className={`rounded-2xl border p-6 ${
              darkMode
                ? "border-[#242432] bg-[#11111a]"
                : "border-gray-200 bg-white"
            }`}
          >

            <div className="mb-4">

              <h3 className="text-xl font-semibold">
                Ask your question
              </h3>

              <p
                className={`mt-1 text-sm ${
                  darkMode
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                LOOP will analyze your customer feedback
                and provide an answer.
              </p>

            </div>

            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Example: What are the biggest problems customers are facing?"
              className={`h-36 w-full resize-none rounded-xl border p-4 outline-none transition ${
                darkMode
                  ? "border-[#30303d] bg-[#181822] text-white placeholder:text-gray-500 focus:border-purple-500"
                  : "border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:border-purple-500"
              }`}
            />

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <p
                className={`text-xs ${
                  darkMode
                    ? "text-gray-500"
                    : "text-gray-400"
                }`}
              >
                Ask anything related to customer feedback.
              </p>

              <button
                type="button"
                onClick={handleAsk}
                disabled={loading || !question.trim()}
                className="rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Thinking..." : "Ask LOOP"}
              </button>

            </div>

          </div>


          {/* ANSWER */}

          {answer && (
            <div
              className={`mt-6 rounded-2xl border p-6 ${
                darkMode
                  ? "border-purple-900/50 bg-[#11111a]"
                  : "border-purple-200 bg-white"
              }`}
            >

              <div className="mb-4 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-xl">
                  🤖
                </div>

                <div>

                  <h3 className="font-semibold">
                    LOOP Answer
                  </h3>

                  <p
                    className={`text-xs ${
                      darkMode
                        ? "text-gray-500"
                        : "text-gray-400"
                    }`}
                  >
                    AI-generated customer insight
                  </p>

                </div>

              </div>

             <div
  className={`prose max-w-none ${
    darkMode ? "prose-invert" : ""
  }`}
>
  <ReactMarkdown
    components={{
      h1: ({ children }) => (
        <h1 className="mb-4 text-2xl font-bold text-purple-600">
          {children}
        </h1>
      ),

      h2: ({ children }) => (
        <h2 className="mb-3 mt-6 text-xl font-bold text-purple-600">
          {children}
        </h2>
      ),

      h3: ({ children }) => (
        <h3 className="mb-2 mt-5 text-lg font-semibold">
          {children}
        </h3>
      ),

      p: ({ children }) => (
        <p
          className={`mb-4 leading-7 ${
            darkMode
              ? "text-gray-300"
              : "text-gray-600"
          }`}
        >
          {children}
        </p>
      ),

      ul: ({ children }) => (
        <ul className="mb-4 list-disc space-y-2 pl-6">
          {children}
        </ul>
      ),

      ol: ({ children }) => (
        <ol className="mb-4 list-decimal space-y-2 pl-6">
          {children}
        </ol>
      ),

      li: ({ children }) => (
        <li
          className={
            darkMode
              ? "text-gray-300"
              : "text-gray-600"
          }
        >
          {children}
        </li>
      ),

      strong: ({ children }) => (
        <strong className="font-semibold text-purple-600">
          {children}
        </strong>
      ),

      table: ({ children }) => (
        <div className="my-5 overflow-x-auto rounded-xl border border-gray-200 dark:border-[#30303d]">
          <table className="w-full min-w-[600px] border-collapse text-sm">
            {children}
          </table>
        </div>
      ),

      thead: ({ children }) => (
        <thead className="bg-purple-50 dark:bg-[#1d1d29]">
          {children}
        </thead>
      ),

      th: ({ children }) => (
        <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-purple-700 dark:border-[#30303d] dark:text-purple-400">
          {children}
        </th>
      ),

      td: ({ children }) => (
        <td
          className={`border-b px-4 py-3 ${
            darkMode
              ? "border-[#242432] text-gray-300"
              : "border-gray-100 text-gray-600"
          }`}
        >
          {children}
        </td>
      ),
    }}
  >
    {answer}
  </ReactMarkdown>
</div>

            </div>
          )}


          {/* EXAMPLE QUESTIONS */}

          <div className="mt-8">

            <div className="mb-5">

              <h3 className="text-xl font-semibold">
                Try asking
              </h3>

              <p
                className={`mt-1 text-sm ${
                  darkMode
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                Choose a question to quickly explore your
                customer feedback.
              </p>

            </div>


            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              <button
                type="button"
                onClick={() =>
                  selectQuestion(
                    "What are the biggest problems customers are facing?"
                  )
                }
                className={`rounded-2xl border p-5 text-left transition hover:-translate-y-0.5 hover:border-purple-400 ${
                  darkMode
                    ? "border-[#242432] bg-[#11111a] text-gray-300"
                    : "border-gray-200 bg-white text-gray-700"
                }`}
              >
                <p className="mb-2 text-sm font-semibold text-purple-600">
                  Customer Problems
                </p>

                <p className="text-sm leading-6">
                  What are the biggest problems customers
                  are facing?
                </p>

              </button>


              <button
                type="button"
                onClick={() =>
                  selectQuestion(
                    "What features do customers want the most?"
                  )
                }
                className={`rounded-2xl border p-5 text-left transition hover:-translate-y-0.5 hover:border-purple-400 ${
                  darkMode
                    ? "border-[#242432] bg-[#11111a] text-gray-300"
                    : "border-gray-200 bg-white text-gray-700"
                }`}
              >
                <p className="mb-2 text-sm font-semibold text-purple-600">
                  Feature Requests
                </p>

                <p className="text-sm leading-6">
                  What features do customers want the most?
                </p>

              </button>


              <button
                type="button"
                onClick={() =>
                  selectQuestion(
                    "Why are customers unhappy with the product?"
                  )
                }
                className={`rounded-2xl border p-5 text-left transition hover:-translate-y-0.5 hover:border-purple-400 ${
                  darkMode
                    ? "border-[#242432] bg-[#11111a] text-gray-300"
                    : "border-gray-200 bg-white text-gray-700"
                }`}
              >
                <p className="mb-2 text-sm font-semibold text-purple-600">
                  Customer Sentiment
                </p>

                <p className="text-sm leading-6">
                  Why are customers unhappy with the product?
                </p>

              </button>


              <button
                type="button"
                onClick={() =>
                  selectQuestion(
                    "What should the product team improve first?"
                  )
                }
                className={`rounded-2xl border p-5 text-left transition hover:-translate-y-0.5 hover:border-purple-400 ${
                  darkMode
                    ? "border-[#242432] bg-[#11111a] text-gray-300"
                    : "border-gray-200 bg-white text-gray-700"
                }`}
              >
                <p className="mb-2 text-sm font-semibold text-purple-600">
                  Product Improvement
                </p>

                <p className="text-sm leading-6">
                  What should the product team improve first?
                </p>

              </button>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}