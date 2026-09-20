"use client";

import { useState } from "react";

export default function CSVUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      setMessage("❌ Please select a CSV file.");
      return;
    }

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setMessage("❌ Please select a CSV file.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("❌ Please login first.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "https://loop-feedback-intelligence.onrender.com/api/feedback/upload-csv",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          `❌ ${data.message || "CSV upload failed."}`
        );
        return;
      }

      setMessage(
        `✅ ${data.message || "CSV uploaded successfully!"}`
      );

      setFile(null);

      const fileInput = document.getElementById(
        "csvFile"
      ) as HTMLInputElement;

      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error("CSV upload error:", error);

      setMessage(
        "❌ Cannot connect to backend. Make sure the backend is running on port 5000."
      );
    } finally {
      setLoading(false);
    }
  };

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
            className="block rounded-lg px-4 py-3 hover:bg-slate-800"
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
            className="block rounded-lg bg-slate-800 px-4 py-3 text-blue-400"
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
            className="rounded-lg px-3 py-3 text-sm hover:bg-slate-800"
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
            className="rounded-lg bg-slate-800 px-3 py-3 text-sm text-blue-400"
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

        <div className="mx-auto max-w-4xl">

          <h2 className="text-2xl font-bold sm:text-3xl">
            CSV Bulk Upload
          </h2>

          <p className="mt-2 mb-8 text-sm text-slate-400 sm:text-base">
            Upload multiple customer feedback items at once.
          </p>


          {/* ================= UPLOAD CARD ================= */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-8">

            <div className="rounded-2xl border-2 border-dashed border-slate-700 p-5 text-center sm:p-10">

              <div className="mb-4 text-5xl">
                📄
              </div>

              <h3 className="text-xl font-semibold">
                Select CSV File
              </h3>

              <p className="mt-2 mb-6 text-sm text-slate-400">
                Upload a CSV file containing customer feedback.
              </p>


              {/* File Input */}
              <input
                id="csvFile"
                type="file"
                accept=".csv,text/csv"
                onChange={(e) => {
                  const selectedFile =
                    e.target.files?.[0] || null;

                  setFile(selectedFile);
                  setMessage("");
                }}
                className="mx-auto block w-full max-w-md text-sm text-slate-300 file:mr-2 file:rounded-lg file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-white hover:file:bg-blue-700 sm:file:mr-4 sm:file:px-4"
              />


              {/* Selected File */}
              {file && (
                <div className="mt-5 overflow-hidden rounded-xl bg-slate-800 p-4">

                  <p className="text-blue-300">
                    Selected file
                  </p>

                  <p className="mt-1 break-all text-white">
                    {file.name}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>

                </div>
              )}


              {/* Upload Button */}
              <button
                onClick={handleUpload}
                disabled={!file || loading}
                className="mt-6 w-full rounded-xl bg-blue-600 px-7 py-3 font-semibold hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 sm:w-auto"
              >
                {loading
                  ? "Uploading & Analyzing..."
                  : "Upload CSV"}
              </button>

            </div>


            {/* Message */}
            {message && (
              <div className="mt-6 break-words rounded-xl bg-slate-800 p-4">
                <p>{message}</p>
              </div>
            )}


            {/* ================= CSV FORMAT ================= */}
            <div className="mt-8 rounded-xl bg-slate-800 p-4 sm:p-6">

              <h3 className="text-lg font-semibold text-blue-300">
                CSV Format
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Your CSV file must contain a column named:
              </p>

              <div className="mt-4 rounded-lg bg-slate-950 p-4">
                <code className="text-green-400">
                  feedback
                </code>
              </div>

              <p className="mt-4 text-sm text-slate-400">
                Example:
              </p>

              <div className="mt-2 overflow-x-auto rounded-lg bg-slate-950 p-4">

              <pre className="min-w-max text-sm text-slate-300">
{`feedback
'The mobile app is very slow.'
'Customer support was excellent.'
'The checkout process keeps crashing.'
'I love the new dashboard.'`}
</pre>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}