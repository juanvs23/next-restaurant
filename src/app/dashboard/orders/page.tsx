"use client";
import { useEffect, useState } from "react";
import { ImPencil, ImCheckmark, ImCross } from "react-icons/im";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface Order {
  _id: string;
  tableLabel: string;
  items: { name: string; quantity: number; price: number }[];
  status: string;
  notes: string;
  observations?: string;
  paymentMethod?: string;
  customer?: { name?: string; email?: string; phone?: string };
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
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editOpen, setEditOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const perPage = 10;

  const fetchOrders = () => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((d) => { setOrders(d); setLoading(false); });
  };

  useEffect(fetchOrders, []);

  const filtered = orders.filter((o) =>
    (o.tableLabel || "").toLowerCase().includes(search.toLowerCase()) ||
    o.status.toLowerCase().includes(search.toLowerCase()),
  );
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchOrders();
  };

  const openEdit = (o: Order) => {
    setEditingOrder(o);
    setEditForm({
      notes: o.notes || "",
      observations: o.observations || "",
      paymentMethod: o.paymentMethod || "cash",
      customerName: o.customer?.name || "",
      customerEmail: o.customer?.email || "",
      customerPhone: o.customer?.phone || "",
    });
    setEditOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingOrder) return;
    await fetch(`/api/orders/${editingOrder._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        notes: editForm.notes,
        observations: editForm.observations,
        paymentMethod: editForm.paymentMethod,
        customer: {
          name: editForm.customerName,
          email: editForm.customerEmail,
          phone: editForm.customerPhone,
        },
      }),
    });
    setEditOpen(false);
    fetchOrders();
  };

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-6">
      <h1 className="dashboard-heading text-3xl font-bold tracking-tight">Orders</h1>

      <Input
        placeholder="Search by table or status..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        className="max-w-xs"
      />

      {filtered.length === 0 ? (
        <p className="text-muted-foreground">No orders yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {paginated.map((o) => (
            <Card key={o._id} className={o.status === "cancelled" ? "opacity-60" : ""}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{o.tableLabel || "Table"}</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {new Date(o.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o._id, e.target.value)}
                      className={`text-xs px-2 py-1 rounded border-none cursor-pointer font-medium ${
                        statusColors[o.status] || "bg-muted text-muted-foreground"
                      }`}
                    >
                      <option value="pending">pending</option>
                      <option value="preparing">preparing</option>
                      <option value="ready">ready</option>
                      <option value="served">served</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                    <Button variant="ghost" size="icon" onClick={() => openEdit(o)}>
                      <ImPencil className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <ul className="space-y-1 text-sm">
                  {o.items.map((item, i) => (
                    <li key={i} className="flex justify-between text-muted-foreground">
                      <span>{item.quantity}x {item.name}</span>
                      {item.price && <span>${(item.price * item.quantity).toFixed(2)}</span>}
                    </li>
                  ))}
                </ul>
                {o.observations && (
                  <p className="text-xs text-muted-foreground italic">
                    Observations: {o.observations}
                  </p>
                )}
                {o.paymentMethod && (
                  <p className="text-xs text-muted-foreground">
                    Payment: <span className="capitalize">{o.paymentMethod}</span>
                  </p>
                )}
                {o.customer?.name && (
                  <p className="text-xs text-muted-foreground">
                    Customer: {o.customer.name}
                    {o.customer.email && ` · ${o.customer.email}`}
                  </p>
                )}
                <div className="flex gap-2 pt-1">
                  {nextStatus[o.status] && (
                    <Button size="sm" onClick={() => updateStatus(o._id, nextStatus[o.status])}>
                      {o.status === "pending" ? "Accept" : "Mark as " + nextStatus[o.status]}
                    </Button>
                  )}
                  {o.status !== "cancelled" && o.status !== "served" && (
                    <Button size="sm" variant="outline" onClick={() => updateStatus(o._id, "cancelled")}>
                      Reject
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          {totalPages > 1 && ` · Page ${page} of ${totalPages}`}
        </p>
        {totalPages > 1 && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="bg-popover sm:max-w-md">
          <DialogHeader><DialogTitle>Edit Order</DialogTitle></DialogHeader>
          {editingOrder && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Observations</Label>
                <Textarea value={editForm.observations} onChange={(e) => setEditForm({ ...editForm, observations: e.target.value })} rows={2} />
              </div>
              <div className="grid gap-2">
                <Label>Waiter Notes</Label>
                <Textarea value={editForm.notes} onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })} rows={2} />
              </div>
              <div className="grid gap-2">
                <Label>Payment Method</Label>
                <Select value={editForm.paymentMethod} onValueChange={(v) => setEditForm({ ...editForm, paymentMethod: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="border-t border-border pt-3">
                <p className="text-sm font-medium mb-2">Customer</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 grid gap-1">
                    <Label className="text-xs">Name</Label>
                    <Input value={editForm.customerName} onChange={(e) => setEditForm({ ...editForm, customerName: e.target.value })} />
                  </div>
                  <div className="grid gap-1">
                    <Label className="text-xs">Email</Label>
                    <Input value={editForm.customerEmail} onChange={(e) => setEditForm({ ...editForm, customerEmail: e.target.value })} />
                  </div>
                  <div className="grid gap-1">
                    <Label className="text-xs">Phone</Label>
                    <Input value={editForm.customerPhone} onChange={(e) => setEditForm({ ...editForm, customerPhone: e.target.value })} />
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)} className="gap-2"><ImCross /> Cancel</Button>
            <Button onClick={handleSaveEdit} className="gap-2"><ImCheckmark /> Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
