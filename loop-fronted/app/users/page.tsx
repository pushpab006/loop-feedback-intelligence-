"use client";

import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  workspaceId: number;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("VIEWER");

  const [message, setMessage] = useState("");

  async function loadUsers() {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch(
        "https://loop-feedback-intelligence.onrender.com/api/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("loopUser");
        window.location.href = "/login";
        return;
      }

      if (response.status === 403) {
        setMessage("Access denied. Admin only.");
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to load users");
      }

      const data = await response.json();

      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setMessage("Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function createUser(e: React.FormEvent) {
    e.preventDefault();

    setMessage("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch(
        "https://loop-feedback-intelligence.onrender.com/api/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            email,
            password,
            role,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to create user");
        return;
      }

      setMessage("User created successfully.");

      setName("");
      setEmail("");
      setPassword("");
      setRole("VIEWER");

      loadUsers();
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong");
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("loopUser");
    window.location.href = "/login";
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 bg-white p-6 shadow-md lg:block">

        <h1 className="mb-8 text-2xl font-bold">
          LOOP
        </h1>

        <nav className="space-y-3">

          <a
            href="/"
            className="block rounded-lg px-4 py-3 hover:bg-gray-100"
          >
            Dashboard
          </a>

          <a
            href="/add-feedback"
            className="block rounded-lg px-4 py-3 hover:bg-gray-100"
          >
            Add Feedback
          </a>

          <a
            href="/feedback-inbox"
            className="block rounded-lg px-4 py-3 hover:bg-gray-100"
          >
            Feedback Inbox
          </a>

          <a
            href="/themes-trends"
            className="block rounded-lg px-4 py-3 hover:bg-gray-100"
          >
            Themes & Trends
          </a>

          <a
            href="/ask-loop"
            className="block rounded-lg px-4 py-3 hover:bg-gray-100"
          >
            Ask LOOP
          </a>

          <a
            href="/reports"
            className="block rounded-lg px-4 py-3 hover:bg-gray-100"
          >
            Reports
          </a>

          <a
            href="/csv-upload"
            className="block rounded-lg px-4 py-3 hover:bg-gray-100"
          >
            CSV Upload
          </a>

          <a
            href="/users"
            className="block rounded-lg bg-gray-200 px-4 py-3 font-medium"
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


      {/* Main Content */}
      <main className="min-h-screen p-6 lg:ml-64">

        <div className="mx-auto max-w-6xl">

          <h2 className="mb-2 text-3xl font-bold">
            User Management
          </h2>

          <p className="mb-8 text-gray-600">
            Manage users in your workspace.
          </p>


          {/* Create User */}
          <section className="mb-8 rounded-xl bg-white p-6 shadow">

            <h3 className="mb-5 text-xl font-semibold">
              Create New User
            </h3>

            <form
              onSubmit={createUser}
              className="grid gap-4 md:grid-cols-2"
            >

              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-lg border px-4 py-3 outline-none focus:ring-2"
                required
              />

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg border px-4 py-3 outline-none focus:ring-2"
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-lg border px-4 py-3 outline-none focus:ring-2"
                required
              />

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="rounded-lg border px-4 py-3 outline-none focus:ring-2"
              >
                <option value="VIEWER">Viewer</option>
                <option value="ANALYST">Analyst</option>
                <option value="ADMIN">Admin</option>
              </select>

              <button
                type="submit"
                className="rounded-lg bg-black px-4 py-3 font-medium text-white hover:bg-gray-800 md:col-span-2"
              >
                Create User
              </button>

            </form>

            {message && (
              <p className="mt-4 rounded-lg bg-gray-100 p-3 text-sm">
                {message}
              </p>
            )}

          </section>


          {/* Users List */}
          <section className="rounded-xl bg-white p-6 shadow">

            <h3 className="mb-5 text-xl font-semibold">
              Workspace Users
            </h3>

            {loading ? (
              <p>Loading users...</p>
            ) : users.length === 0 ? (
              <p className="text-gray-500">
                No users found.
              </p>
            ) : (
              <div className="overflow-x-auto">

                <table className="w-full border-collapse">

                  <thead>
                    <tr className="border-b text-left">
                      <th className="p-3">Name</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Workspace</th>
                    </tr>
                  </thead>

                  <tbody>

                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b last:border-0"
                      >

                        <td className="p-3">
                          {user.name}
                        </td>

                        <td className="p-3">
                          {user.email}
                        </td>

                        <td className="p-3 font-medium">
                          {user.role}
                        </td>

                        <td className="p-3">
                          {user.workspaceId}
                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>
            )}

          </section>

        </div>

      </main>

    </div>
  );
}