"use client";

import { useState } from "react";

export default function AskLoop() {
const [question, setQuestion] = useState("");
const [answer, setAnswer] = useState("");

const handleAsk = async () => {
if (!question.trim()) return;

setAnswer("Thinking...");

try {
  const token = localStorage.getItem("token");

  if (!token) {
    setAnswer("Please login again.");
    return;
  }

  const response = await fetch(
    "http://localhost:5000/api/ask-loop",
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
    setAnswer(data.answer);
  } else {
    setAnswer(data.message || "Something went wrong.");
  }
} catch (error) {
  console.error(error);
  setAnswer("Cannot connect to backend.");
}

};

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
        href="/themes-trends"
        className="block px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg"
      >
        Themes & Trends
      </a>

      <a
        href="/ask-loop"
        className="block bg-blue-600 rounded-lg px-4 py-3"
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
    <div className="max-w-4xl mx-auto">

      <div className="mb-8">
        <h2 className="text-3xl font-bold">
          Ask LOOP
        </h2>

        <p className="text-slate-400 mt-2">
          Ask questions about your customer feedback.
        </p>
      </div>

      {/* Question Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

        <label className="block text-sm text-slate-400 mb-3">
          Ask a question
        </label>

        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Example: What are the biggest problems customers are facing?"
          className="w-full h-36 p-4 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-blue-500 resize-none"
        />

        <button
          onClick={handleAsk}
          className="mt-4 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold"
        >
          Ask LOOP
        </button>
      </div>

      {/* Answer */}
      {answer && (
        <div className="mt-6 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-blue-400 mb-4">
            LOOP Answer
          </h3>

          <p className="text-slate-300 leading-7">
            {answer}
          </p>
        </div>
      )}

      {/* Example Questions */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">
          Try asking
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <button
            onClick={() =>
              setQuestion(
                "What are the biggest problems customers are facing?"
              )
            }
            className="text-left bg-slate-900 border border-slate-800 hover:border-blue-500 rounded-xl p-4 text-slate-300"
          >
            What are the biggest problems customers are facing?
          </button>

          <button
            onClick={() =>
              setQuestion(
                "What features do customers want the most?"
              )
            }
            className="text-left bg-slate-900 border border-slate-800 hover:border-blue-500 rounded-xl p-4 text-slate-300"
          >
            What features do customers want the most?
          </button>

          <button
            onClick={() =>
              setQuestion(
                "Why are customers unhappy with the product?"
              )
            }
            className="text-left bg-slate-900 border border-slate-800 hover:border-blue-500 rounded-xl p-4 text-slate-300"
          >
            Why are customers unhappy with the product?
          </button>

          <button
            onClick={() =>
              setQuestion(
                "What should the product team improve first?"
              )
            }
            className="text-left bg-slate-900 border border-slate-800 hover:border-blue-500 rounded-xl p-4 text-slate-300"
          >
            What should the product team improve first?
          </button>

        </div>
      </div>

    </div>
  </section>
</main>

);
}