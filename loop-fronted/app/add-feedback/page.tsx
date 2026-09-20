"use client";

import { useState } from "react";

export default function AddFeedback() {
  const [feedback, setFeedback] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!feedback.trim()) {
      setMessage("Please enter feedback.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("❌ Please login again.");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/feedback",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            feedback: feedback,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Feedback submitted successfully!");
        setFeedback("");
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch {
      setMessage("❌ Cannot connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-slate-900 rounded-2xl p-8 shadow-lg">
        
        <h1 className="text-3xl font-bold text-blue-400 mb-2">
          Add Feedback
        </h1>

        <p className="text-slate-400 mb-6">
          Add customer feedback to LOOP.
        </p>

        <form onSubmit={handleSubmit}>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Enter customer feedback..."
            className="w-full h-40 p-4 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-blue-500 resize-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 px-6 py-3 rounded-xl font-semibold"
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>

        {message && (
          <p className="mt-5 text-lg">
            {message}
          </p>
        )}

      </div>
    </main>
  );
}
