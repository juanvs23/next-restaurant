"use client";
import { useEffect, useState } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    fetch("/api/users")
      .then((r) => r.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      });
  };

  useEffect(fetchUsers, []);

  const updateRole = async (id: string, role: string) => {
    await fetch(`/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    fetchUsers();
  };

  return (
    <div>
      <h1 className="text-3xl text-white mb-6">Users</h1>
      {loading ? (
        <p className="text-white2">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-golden border-b border-golden/20">
                <th className="pb-3 pr-4">Name</th>
                <th className="pb-3 pr-4">Email</th>
                <th className="pb-3 pr-4">Role</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-golden/10">
                  <td className="py-3 pr-4 text-white">{u.name}</td>
                  <td className="py-3 pr-4 text-white2 text-sm">{u.email}</td>
                  <td className="py-3 pr-4">
                    <select
                      value={u.role}
                      onChange={(e) => updateRole(u._id, e.target.value)}
                      className="bg-black border border-golden/30 rounded px-2 py-1 text-golden text-sm"
                    >
                      <option value="user">user</option>
                      <option value="staff">staff</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      u.role === "admin" ? "bg-golden/20 text-golden" :
                      u.role === "staff" ? "bg-blue-500/20 text-blue-400" :
                      "bg-white/10 text-white2"
                    }`}>
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
