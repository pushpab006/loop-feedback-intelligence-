"use client";

export default function Sidebar() {

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loopUser");

    window.location.href = "/login";
  };

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 hidden md:block min-h-screen">

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

      <button
        onClick={handleLogout}
        className="mt-10 w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
      >
        Logout
      </button>

    </aside>
  );
}