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
import { useT } from "@/i18n/useT";

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
  const [orders, setOrders] = useState<any[]>([]);
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
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split("T")[0]);
  const [statusFilter, setStatusFilter] = useState("open");
  const [searchName, setSearchName] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 30;
  const { t } = useT();

  const fetchAll = (date?: string) => {
    const query = date ? `?date=${date}` : "";
    Promise.all([
      fetch("/api/tables").then(r => r.json()),
      fetch(`/api/comandas${query}`).then(r => r.json()),
      fetch("/api/products").then(r => r.json()),
      fetch("/api/orders").then(r => r.json()),
    ]).then(([t, c, p, o]) => { setTables(t); setComandas(c); setProducts(p); setOrders(o); setLoading(false); });
  };

  const refresh = () => fetchAll(filterDate);

  const fetchPedidos = (comandaId: string) => {
    fetch(`/api/pedidos?comandaId=${comandaId}`).then(r => r.json()).then(setPedidos);
  };

  useEffect(() => { refresh(); }, []);
  useEffect(() => { if (selectedTable) fetchPedidos(selectedTable._id); }, [selectedTable]);

  const filteredComandas = comandas
    .filter((c) => statusFilter === "all" ? true : c.status === statusFilter)
    .filter((c) => !searchName || (c.customerName || "").toLowerCase().includes(searchName.toLowerCase()));
  const totalPages = Math.ceil(filteredComandas.length / perPage);
  const paginated = filteredComandas.slice((page - 1) * perPage, page * perPage);

  const paidComandaIds = new Set(
    orders.filter((o: any) => o.status === "paid").map((o: any) => o.comandaId?.toString()).filter(Boolean),
  );

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

  const updateComandaStatus = async (status: string) => {
    if (!selectedTable) return;
    await fetch(`/api/comandas/${selectedTable._id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setSelectedTable({ ...selectedTable, status });
    fetchAll(filterDate);
  };

  if (loading) return <p className="text-muted-foreground">{t("common.loading")}</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="dashboard-heading text-3xl font-bold tracking-tight">{t("comanda.title")}</h1>
        <Button onClick={() => setOpenComanda(true)} className="gap-2"><ImPlus /> {t("comanda.newComanda")}</Button>
      </div>

      <div className="flex items-center gap-4">
        <Input type="date" value={filterDate} onChange={(e) => { setFilterDate(e.target.value); fetchAll(e.target.value); }} className="w-fit" />
        <Input placeholder={t("comanda.searchByCustomer")} value={searchName} onChange={(e) => { setSearchName(e.target.value); setPage(1); }} className="max-w-xs" />
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          {["all", "open", "closed", "rejected"].map((s) => {
            const labels: Record<string, string> = {
              all: t("comanda.allComandas"),
              open: t("comanda.openComandas"),
              closed: t("common.closed"),
              rejected: t("common.rejected"),
            };
            return (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${statusFilter === s ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
              {labels[s]}
            </button>
            );
          })}
        </div>
        <span className="text-sm text-muted-foreground">{filteredComandas.length} {t("comanda.title")}</span>
      </div>

      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {paginated.map((c) => (
          <button
            key={c._id}
            onClick={() => { setSelectedTable(c); fetchPedidos(c._id); }}
            className={`border-2 rounded-xl p-4 text-center transition-all hover:scale-105 ${
              selectedTable?._id === c._id ? "border-golden bg-golden/10" : "border-border hover:border-golden/30"
            }`}
          >
            <p className="text-lg font-bold">{c.tableLabel || "Bar"}</p>
            <p className="text-xs text-muted-foreground">{c.customerName || "—"}</p>
            {paidComandaIds.has(c._id) && (
              <p className="text-xs text-green-500 font-medium mt-1">✓ Paid</p>
            )}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredComandas.length} {filteredComandas.length === 1 ? t("comanda.title") : t("comanda.title") + "s"}
          {totalPages > 1 && ` · Page ${page} of ${totalPages}`}
        </p>
        {totalPages > 1 && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>{t("common.previous")}</Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>{t("common.next")}</Button>
          </div>
        )}
      </div>

      
      {selectedTable && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif text-golden">
              {selectedTable.tableLabel || "Bar"} — {selectedTable.customerName || "Walk-in"}
            </h2>
            <div className="flex items-center gap-3">
              {(() => {
                const today = new Date().toISOString().split("T")[0];
                const created = new Date(selectedTable.createdAt).toISOString().split("T")[0];
                const isToday = today === created;
                const isPaid = paidComandaIds.has(selectedTable._id);
                const canEdit = !isPaid && (selectedTable.status === "open" || (selectedTable.status === "rejected" && isToday));

                if (canEdit) {
                  return (
                      <select value={selectedTable.status} onChange={(e) => {
                      const newStatus = e.target.value;
                      if (selectedTable.status !== "open" && newStatus === "open") {
                        if (selectedTable.status !== "rejected") { alert("Only rejected comandas can be reopened."); return; }
                        if (!confirm("Reopen this comanda?")) return;
                      }
                      updateComandaStatus(newStatus);
                    }}
                      className="text-sm bg-background border border-input rounded px-2 py-1 capitalize">
                      <option value="open">{t("comanda.openComandas")}</option>
                      <option value="closed">{t("common.closed")}</option>
                      <option value="rejected">{t("common.rejected")}</option>
                    </select>
                  );
                }
                return (
                  <span className="text-sm text-muted-foreground capitalize px-2 py-1 border border-transparent">
                    {selectedTable.status}
                  </span>
                );
              })()}
              {selectedTable.status === "open" && (
              <Button size="sm" onClick={() => openPedido(selectedTable._id)} className="gap-2"><ImPlus /> {t("comanda.addOrder")}</Button>
            )}
            {(selectedTable.status === "closed" || selectedTable.status === "rejected") && (
              <span className="text-xs text-muted-foreground italic">{t("comanda.title")} {selectedTable.status} — no more rounds</span>
            )}
          </div>
          </div>

          {pedidos.length === 0 && <p className="text-muted-foreground">No pedidos yet.</p>}

          <div className="space-y-3">
            {pedidos.map((p) => (
              <div key={p._id} className="border rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${statusColors[p.status]}`}>{p.status}</span>
                  {selectedTable.status === "open" ? (
                    <select value={p.status} onChange={(e) => updatePedidoStatus(p._id, e.target.value)}
                      className="text-xs bg-background border border-input rounded px-2 py-1">
                      <option value="pending">{t("comanda.pending")}</option>
                      <option value="preparing">{t("comanda.preparing")}</option>
                      <option value="ready">{t("comanda.ready")}</option>
                      <option value="served">{t("comanda.served")}</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
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
                  <span>{t("common.subtotal")}</span>
                  <span>${p.items.reduce((s: number, i: any) => s + i.price * i.quantity, 0).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between text-lg font-bold border-t-2 pt-4">
            <span>{t("common.total")}</span>
            <span className="text-golden">
              ${pedidos.reduce((s, p) => s + p.items.reduce((s2: number, i: any) => s2 + i.price * i.quantity, 0), 0).toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {!selectedTable && (
        <p className="text-muted-foreground text-center py-12">Select or create a comanda to start</p>
      )}

      <Dialog open={openComanda} onOpenChange={setOpenComanda}>
        <DialogContent className="bg-popover">
          <DialogHeader><DialogTitle>{t("comanda.newComanda")}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>{t("comanda.table")}</Label>
              <Select value={comandaForm.tableId} onValueChange={(v) => setComandaForm({ ...comandaForm, tableId: v })}>
                <SelectTrigger><SelectValue placeholder={t("comanda.selectTable")} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Bar / No table</SelectItem>
                  {tables.filter((t) => t.status !== "maintenance").map((t) => (
                    <SelectItem key={t._id} value={t._id}>{t.name || t.tableId} ({t.capacity} pax)</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>{t("comanda.customerName")}</Label>
              <Input value={comandaForm.customerName} onChange={(e) => setComandaForm({ ...comandaForm, customerName: e.target.value })} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="delivery" checked={comandaForm.isDelivery}
                onChange={(e) => setComandaForm({ ...comandaForm, isDelivery: e.target.checked })} className="rounded" />
              <Label htmlFor="delivery">{t("comanda.isDelivery")}</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenComanda(false)} className="gap-2"><ImCross /> {t("common.cancel")}</Button>
            <Button onClick={createComanda} className="gap-2"><ImCheckmark /> {t("common.create")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      
      <Dialog open={pedidoOpen} onOpenChange={setPedidoOpen}>
        <DialogContent className="bg-popover sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{t("comanda.addOrder")}</DialogTitle></DialogHeader>
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
                <Label>{t("comanda.items")}</Label>
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
              <Label>{t("common.notes")}</Label>
              <Textarea value={pedidoNotes} onChange={(e) => setPedidoNotes(e.target.value)} rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPedidoOpen(false)} className="gap-2"><ImCross /> {t("common.cancel")}</Button>
            <Button onClick={savePedido} disabled={pedidoItems.length === 0} className="gap-2"><ImCheckmark /> {t("comanda.sendToKitchen")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
