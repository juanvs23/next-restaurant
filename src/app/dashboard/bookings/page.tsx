"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    <div className="space-y-6">
      <h1 className="dashboard-heading text-3xl font-bold tracking-tight">Bookings</h1>
      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <div className="grid gap-4">
          {bookings.map((b) => (
            <Card key={b._id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{b.firstName} {b.lastName}</CardTitle>
                  <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary capitalize">{b.status}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-1 text-sm text-muted-foreground">
                <p>{b.email}</p>
                <p>{new Date(b.dateTime).toLocaleString()}</p>
                <p>{b.numberPersons} guests</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
