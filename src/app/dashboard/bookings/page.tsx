"use client";
import { useEffect, useState } from "react";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bookings")
      .then((r) => r.json())
      .then((data) => {
        setBookings(data);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1 className="text-3xl text-white mb-6">Bookings</h1>
      {loading ? (
        <p className="text-white2">Loading...</p>
      ) : (
        <div className="grid gap-4">
          {bookings.map((b) => (
            <div key={b._id} className="bg-black/50 border border-golden/20 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-golden">{b.firstName} {b.lastName}</h3>
                <span className="px-2 py-1 rounded text-xs bg-golden/20 text-golden">{b.status}</span>
              </div>
              <p className="text-white2 text-sm">{b.email}</p>
              <p className="text-white2 text-sm">{new Date(b.dateTime).toLocaleString()}</p>
              <p className="text-white2 text-sm">{b.numberPersons} guests</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
