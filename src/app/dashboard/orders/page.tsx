"use client";
import { useEffect, useState } from "react";
import { ImPlus, ImCheckmark, ImCross } from "react-icons/im";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [comandas, setComandas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [form, setForm] = useState({
    comandaId: "", customerName: "", customerEmail: "", customerPhone: "",
    paymentMethod: "cash", serviceCharge: 0, deliveryCost: 0,
  });
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [preview, setPreview] = useState<any[]>([]);

  const fetchOrders = () => {
    fetch("/api/orders").then((r) => r.json()).then((d) => { setOrders(d); setLoading(false); });
  };

  const openCreate = () => {
    fetch("/api/comandas").then((r) => r.json()).then((cs) => {
      const openCs = cs.filter((c: any) => c.status === "open");
      setComandas(openCs);
      setForm({ comandaId: "", customerName: "", customerEmail: "", customerPhone: "", paymentMethod: "cash", serviceCharge: 0, deliveryCost: 0 });
      setPedidos([]);
      setPreview([]);
      setOpen(true);
    });
  };

  const loadComanda = async (comandaId: string) => {
    if (!comandaId) { setPedidos([]); setPreview([]); setForm({ ...form, comandaId: "", serviceCharge: 0, deliveryCost: 0 }); return; }
    const comanda = comandas.find((c) => c._id === comandaId);
    const res = await fetch(`/api/pedidos?comandaId=${comandaId}`);
    const ps = await res.json();
    setPedidos(ps);

    const items: any[] = [];
    const itemMap = new Map<string, any>();
    for (const p of ps) {
      for (const it of p.items) {
        const key = it.name;
        if (itemMap.has(key)) itemMap.get(key).quantity += it.quantity;
        else itemMap.set(key, { name: it.name, price: it.price, quantity: it.quantity });
      }
    }
    const consolidated = Array.from(itemMap.values());
    setPreview(consolidated);

    const subtotal = consolidated.reduce((s: number, i: any) => s + i.price * i.quantity, 0);
    const sc = comanda?.tableId && !comanda?.isDelivery ? Math.round(subtotal * 0.1 * 100) / 100 : 0;
    setForm({ ...form, comandaId, customerName: comanda?.customerName || "", serviceCharge: sc, deliveryCost: comanda?.isDelivery ? 5 : 0 });
  };

  const handleCreate = async () => {
    const subtotal = preview.reduce((s: number, i: any) => s + i.price * i.quantity, 0);
    await fetch("/api/orders", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        comandaId: form.comandaId || undefined,
        pedidoIds: pedidos.map((p) => p._id),
        items: preview,
        tableLabel: comandas.find((c) => c._id === form.comandaId)?.tableLabel,
        isDelivery: comandas.find((c) => c._id === form.comandaId)?.isDelivery || false,
        serviceCharge: form.serviceCharge,
        deliveryCost: form.deliveryCost,
        subtotal,
        paymentMethod: form.paymentMethod,
        customer: { name: form.customerName, email: form.customerEmail, phone: form.customerPhone },
        status: "paid",
      }),
    });
    // Close comanda
    if (form.comandaId) {
      await fetch(`/api/comandas/${form.comandaId}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "closed" }),
      });
    }
    setOpen(false);
    fetchOrders();
  };

  useEffect(fetchOrders, []);

  const filtered = orders.filter((o) =>
    (o.customer?.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (o.paymentMethod || "").toLowerCase().includes(search.toLowerCase()),
  );
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="dashboard-heading text-3xl font-bold tracking-tight">Billing</h1>
        <Button onClick={openCreate} className="gap-2"><ImPlus /> New Bill</Button>
      </div>

      <Input placeholder="Search by customer..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="max-w-xs" />

      <div className="grid gap-4 md:grid-cols-2">
        {paginated.map((o) => (
          <Card key={o._id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{o.customer?.name || "Walk-in"}</CardTitle>
                  <p className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  o.status === "paid" ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                }`}>{o.status}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p className="text-muted-foreground">{o.items?.length || 0} items · {o.paymentMethod}</p>
              {o.isDelivery && <p className="text-xs text-muted-foreground">Delivery</p>}
              <div className="border-t pt-2 space-y-0.5 font-medium">
                {o.serviceCharge > 0 && <div className="flex justify-between text-xs text-muted-foreground"><span>Service (10%)</span><span>${o.serviceCharge.toFixed(2)}</span></div>}
                {o.deliveryCost > 0 && <div className="flex justify-between text-xs text-muted-foreground"><span>Delivery</span><span>${o.deliveryCost.toFixed(2)}</span></div>}
                <div className="flex justify-between text-golden"><span>Total</span><span>${o.total?.toFixed(2)}</span></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{filtered.length} bills · Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
          </div>
        </div>
      )}

      {/* New Bill Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-popover sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>New Bill</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Comanda</Label>
              <Select value={form.comandaId} onValueChange={loadComanda}>
                <SelectTrigger><SelectValue placeholder="Select comanda..." /></SelectTrigger>
                <SelectContent>
                  {comandas.map((c) => (
                    <SelectItem key={c._id} value={c._id}>
                      {c.tableLabel || "Bar"} — {c.customerName || "Walk-in"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {preview.length > 0 && (
              <div className="border rounded-lg p-3 space-y-1 text-sm">
                <Label>Items</Label>
                {preview.map((item, i) => (
                  <div key={i} className="flex justify-between text-muted-foreground">
                    <span>{item.quantity}x {item.name}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-medium border-t pt-2">
                  <span>Subtotal</span>
                  <span>${preview.reduce((s: number, i: any) => s + i.price * i.quantity, 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Service (10%)</span>
                  <span>${form.serviceCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Delivery</span>
                  <Input type="number" className="w-20 h-7 text-xs" value={form.deliveryCost}
                    onChange={(e) => setForm({ ...form, deliveryCost: Number(e.target.value) })} />
                </div>
                <div className="flex justify-between font-bold text-golden border-t pt-2">
                  <span>Total</span>
                  <span>
                    ${(preview.reduce((s: number, i: any) => s + i.price * i.quantity, 0) + form.serviceCharge + form.deliveryCost).toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            <div className="grid gap-2">
              <Label>Payment Method</Label>
              <Select value={form.paymentMethod} onValueChange={(v) => setForm({ ...form, paymentMethod: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                  <SelectItem value="invoice">Invoice</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border-t pt-3">
              <p className="text-sm font-medium mb-2">Customer</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 grid gap-1">
                  <Label className="text-xs">Name</Label>
                  <Input value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
                </div>
                <div className="grid gap-1">
                  <Label className="text-xs">Email</Label>
                  <Input value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })} />
                </div>
                <div className="grid gap-1">
                  <Label className="text-xs">Phone</Label>
                  <Input value={form.customerPhone} onChange={(e) => setForm({ ...form, customerPhone: e.target.value })} />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} className="gap-2"><ImCross /> Cancel</Button>
            <Button onClick={handleCreate} disabled={preview.length === 0} className="gap-2"><ImCheckmark /> Finalize Bill</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
