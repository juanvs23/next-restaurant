"use client";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/users")
      .then((r) => r.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1 className="text-3xl text-white mb-6">Users</h1>
      {loading ? (
        <p className="text-white2">Loading...</p>
      ) : (
        <div className="grid gap-4">
          {users.map((u) => (
            <div key={u._id} className="bg-black/50 border border-golden/20 rounded-lg p-4 flex justify-between items-center">
              <div>
                <h3 className="text-golden">{u.name}</h3>
                <p className="text-white2 text-sm">{u.email}</p>
              </div>
              <span className="px-2 py-1 rounded text-xs bg-golden/20 text-golden">{u.role}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
