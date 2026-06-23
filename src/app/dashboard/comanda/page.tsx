"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ImPlus, ImCheckmark, ImCross } from "react-icons/im";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface TableInfo { _id: string; tableId: string; name: string; capacity: number; location: string; status: string; }
interface PedidoItem { productId?: string; name: string; price: number; quantity: number; notes?: string; }

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-500",
  preparing: "bg-blue-500/10 text-blue-500",
  ready: "bg-green-500/10 text-green-500",
  served: "bg-muted text-muted-foreground",
  cancelled: "bg-red-500/10 text-red-500",
};

export default function ComandaPage() {
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [comandas, setComandas] = useState<any[]>([]);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState<any>(null);

  // New comanda dialog
  const [openComanda, setOpenComanda] = useState(false);
  const [comandaForm, setComandaForm] = useState({ tableId: "", customerName: "", isDelivery: false });

  // New pedido dialog (inside comanda)
  const [pedidoOpen, setPedidoOpen] = useState(false);
  const [pedidoComandaId, setPedidoComandaId] = useState<string | null>(null);
  const [pedidoSearch, setPedidoSearch] = useState("");
  const [pedidoItems, setPedidoItems] = useState<PedidoItem[]>([]);
  const [pedidoNotes, setPedidoNotes] = useState("");

  const fetchAll = () => {
    Promise.all([
      fetch("/api/tables").then(r => r.json()),
      fetch("/api/comandas").then(r => r.json()),
      fetch("/api/products").then(r => r.json()),
    ]).then(([t, c, p]) => { setTables(t); setComandas(c); setProducts(p); setLoading(false); });
  };

  const fetchPedidos = (comandaId: string) => {
    fetch(`/api/pedidos?comandaId=${comandaId}`).then(r => r.json()).then(setPedidos);
  };

  useEffect(fetchAll, []);
  useEffect(() => { if (selectedTable) fetchPedidos(selectedTable._id); }, [selectedTable]);

  const activeComandas = comandas.filter((c) => c.status === "open");

  const createComanda = async () => {
    const table = tables.find((t) => t._id === comandaForm.tableId);
    const res = await fetch("/api/comandas", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tableId: comandaForm.tableId || null,
        tableLabel: table?.name || table?.tableId || "Barra",
        customerName: comandaForm.customerName,
        isDelivery: comandaForm.isDelivery,
        status: "open",
      }),
    });
    const newComanda = await res.json();
    setOpenComanda(false);
    setComandaForm({ tableId: "", customerName: "", isDelivery: false });
    setSelectedTable(newComanda);
    fetchPedidos(newComanda._id);
    fetchAll();
  };

  const openPedido = (comandaId: string) => {
    setPedidoComandaId(comandaId);
    setPedidoItems([]);
    setPedidoNotes("");
    setPedidoSearch("");
    setPedidoOpen(true);
  };

  const addItem = (p: any) => {
    setPedidoItems((prev) => [...prev, { productId: p._id, name: p.name, price: p.price, quantity: 1 }]);
  };

  const updateItemQty = (idx: number, qty: number) => {
    setPedidoItems((prev) => {
      const items = [...prev];
      if (qty <= 0) { items.splice(idx, 1); return items; }
      items[idx] = { ...items[idx], quantity: qty };
      return items;
    });
  };

  const savePedido = async () => {
    if (!pedidoComandaId || pedidoItems.length === 0) return;
    await fetch("/api/pedidos", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comandaId: pedidoComandaId, items: pedidoItems, notes: pedidoNotes, status: "pending" }),
    });
    setPedidoOpen(false);
    fetchPedidos(pedidoComandaId);
  };

  const updatePedidoStatus = async (id: string, status: string) => {
    await fetch(`/api/pedidos/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    if (selectedTable) fetchPedidos(selectedTable._id);
  };

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="dashboard-heading text-3xl font-bold tracking-tight">Comanda</h1>
        <Button onClick={() => setOpenComanda(true)} className="gap-2"><ImPlus /> New Comanda</Button>
      </div>

      {/* Active comandas */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {activeComandas.map((c) => (
          <button
            key={c._id}
            onClick={() => { setSelectedTable(c); fetchPedidos(c._id); }}
            className={`border-2 rounded-xl p-4 text-center transition-all hover:scale-105 ${
              selectedTable?._id === c._id ? "border-golden bg-golden/10" : "border-border hover:border-golden/30"
            }`}
          >
            <p className="text-lg font-bold">{c.tableLabel || "Bar"}</p>
            <p className="text-xs text-muted-foreground">{c.customerName || "—"}</p>
          </button>
        ))}
      </div>

      {/* Selected comanda detail */}
      {selectedTable && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif text-golden">
              {selectedTable.tableLabel || "Bar"} — {selectedTable.customerName || "Walk-in"}
            </h2>
            <Button size="sm" onClick={() => openPedido(selectedTable._id)} className="gap-2"><ImPlus /> New Round</Button>
          </div>

          {pedidos.length === 0 && <p className="text-muted-foreground">No pedidos yet.</p>}

          <div className="space-y-3">
            {pedidos.map((p) => (
              <div key={p._id} className="border rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${statusColors[p.status]}`}>{p.status}</span>
                  <select value={p.status} onChange={(e) => updatePedidoStatus(p._id, e.target.value)}
                    className="text-xs bg-background border border-input rounded px-2 py-1">
                    <option value="pending">pending</option>
                    <option value="preparing">preparing</option>
                    <option value="ready">ready</option>
                    <option value="served">served</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                </div>
                <ul className="text-sm space-y-1">
                  {p.items.map((item: any, i: number) => (
                    <li key={i} className="flex justify-between text-muted-foreground">
                      <span>{item.quantity}x {item.name}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                {p.notes && <p className="text-xs italic text-muted-foreground">{p.notes}</p>}
                <div className="flex justify-between text-sm font-medium border-t pt-2">
                  <span>Subtotal</span>
                  <span>${p.items.reduce((s: number, i: any) => s + i.price * i.quantity, 0).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between text-lg font-bold border-t-2 pt-4">
            <span>Total</span>
            <span className="text-golden">
              ${pedidos.reduce((s, p) => s + p.items.reduce((s2: number, i: any) => s2 + i.price * i.quantity, 0), 0).toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {/* No selection */}
      {!selectedTable && (
        <p className="text-muted-foreground text-center py-12">Select or create a comanda to start</p>
      )}

      {/* New Comanda Dialog */}
      <Dialog open={openComanda} onOpenChange={setOpenComanda}>
        <DialogContent className="bg-popover">
          <DialogHeader><DialogTitle>New Comanda</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Table</Label>
              <Select value={comandaForm.tableId} onValueChange={(v) => setComandaForm({ ...comandaForm, tableId: v })}>
                <SelectTrigger><SelectValue placeholder="Bar / without table..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Bar / No table</SelectItem>
                  {tables.filter((t) => t.status !== "maintenance").map((t) => (
                    <SelectItem key={t._id} value={t._id}>{t.name || t.tableId} ({t.capacity} pax)</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Customer Name</Label>
              <Input value={comandaForm.customerName} onChange={(e) => setComandaForm({ ...comandaForm, customerName: e.target.value })} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="delivery" checked={comandaForm.isDelivery}
                onChange={(e) => setComandaForm({ ...comandaForm, isDelivery: e.target.checked })} className="rounded" />
              <Label htmlFor="delivery">Delivery</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenComanda(false)} className="gap-2"><ImCross /> Cancel</Button>
            <Button onClick={createComanda} className="gap-2"><ImCheckmark /> Open Comanda</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Pedido Dialog */}
      <Dialog open={pedidoOpen} onOpenChange={setPedidoOpen}>
        <DialogContent className="bg-popover sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>New Round</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Products</Label>
              <Input placeholder="Search..." value={pedidoSearch} onChange={(e) => setPedidoSearch(e.target.value)} />
              <div className="max-h-40 overflow-y-auto border rounded-lg p-2 space-y-1">
                {products.filter((p) => p.name.toLowerCase().includes(pedidoSearch.toLowerCase())).map((p) => (
                  <div key={p._id} className="flex justify-between text-sm py-1 px-2 hover:bg-accent/50 rounded cursor-pointer" onClick={() => addItem(p)}>
                    <span>{p.name}</span><span className="text-muted-foreground">${p.price}</span>
                  </div>
                ))}
              </div>
            </div>
            {pedidoItems.length > 0 && (
              <div className="border rounded-lg p-3 space-y-2">
                <Label>Items</Label>
                {pedidoItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span>{item.name}</span>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="h-6 w-6 p-0" onClick={() => updateItemQty(idx, item.quantity - 1)}>-</Button>
                      <span className="w-6 text-center">{item.quantity}</span>
                      <Button variant="outline" size="sm" className="h-6 w-6 p-0" onClick={() => updateItemQty(idx, item.quantity + 1)}>+</Button>
                      <span className="w-16 text-right">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="grid gap-2">
              <Label>Notes (kitchen)</Label>
              <Textarea value={pedidoNotes} onChange={(e) => setPedidoNotes(e.target.value)} rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPedidoOpen(false)} className="gap-2"><ImCross /> Cancel</Button>
            <Button onClick={savePedido} disabled={pedidoItems.length === 0} className="gap-2"><ImCheckmark /> Send to Kitchen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
