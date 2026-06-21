"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Order {
  _id: string;
  tableLabel: string;
  items: { name: string; quantity: number; price: number }[];
  status: string;
  notes: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-500",
  preparing: "bg-blue-500/10 text-blue-500",
  ready: "bg-green-500/10 text-green-500",
  served: "bg-muted text-muted-foreground",
  cancelled: "bg-red-500/10 text-red-500",
};

const nextStatus: Record<string, string> = {
  pending: "preparing",
  preparing: "ready",
  ready: "served",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((d) => { setOrders(d); setLoading(false); });
  };

  useEffect(fetchOrders, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchOrders();
  };

  const cancelOrder = async (id: string) => {
    if (!confirm("Cancel this order?")) return;
    await updateStatus(id, "cancelled");
  };

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-6">
      <h1 className="dashboard-heading text-3xl font-bold tracking-tight">Orders</h1>

      {orders.length === 0 ? (
        <p className="text-muted-foreground">No orders yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {orders.map((o) => (
            <Card key={o._id} className={o.status === "cancelled" ? "opacity-60" : ""}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {o.tableLabel || "Table"}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {new Date(o.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant="outline" className={statusColors[o.status]}>
                    {o.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-1 text-sm">
                  {o.items.map((item, i) => (
                    <li key={i} className="flex justify-between text-muted-foreground">
                      <span>{item.quantity}x {item.name}</span>
                      {item.price && <span>${(item.price * item.quantity).toFixed(2)}</span>}
                    </li>
                  ))}
                </ul>

                {o.notes && (
                  <p className="text-xs text-muted-foreground italic">{o.notes}</p>
                )}

                <div className="flex gap-2 pt-1">
                  {nextStatus[o.status] && (
                    <Button size="sm" onClick={() => updateStatus(o._id, nextStatus[o.status])}>
                      {o.status === "pending" ? "Accept" : "Mark as " + nextStatus[o.status]}
                    </Button>
                  )}
                  {o.status !== "cancelled" && o.status !== "served" && (
                    <Button size="sm" variant="outline" onClick={() => cancelOrder(o._id)}>
                      Reject
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
