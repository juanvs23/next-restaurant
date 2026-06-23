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

interface TableInfo {
  _id: string;
  tableId: string;
  name: string;
  capacity: number;
  location: string;
  status: string;
}

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  tableId: string;
  tableLabel: string;
  items: OrderItem[];
  status: string;
  observations?: string;
  paymentMethod?: string;
  customer?: { name?: string; email?: string; phone?: string };
}

const statusColors: Record<string, string> = {
  available: "border-green-500/40 bg-green-500/5",
  occupied: "border-red-500/40 bg-red-500/5",
  reserved: "border-yellow-500/40 bg-yellow-500/5",
  maintenance: "border-gray-500/20 bg-gray-500/5 opacity-50",
};

const orderStatusColors: Record<string, string> = {
  pending: "text-yellow-500",
  preparing: "text-blue-500",
  ready: "text-green-500",
  served: "text-muted-foreground",
  cancelled: "text-red-500",
};

export default function ComandaPage() {
  const { data: session } = useSession();
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState<TableInfo | null>(null);
  const [tableOrders, setTableOrders] = useState<Order[]>([]);
  const [orderOpen, setOrderOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [createForm, setCreateForm] = useState({
    paymentMethod: "cash",
    customerName: "", customerEmail: "", customerPhone: "",
    observations: "",
    items: [] as OrderItem[],
  });

  const fetchData = () => {
    Promise.all([
      fetch("/api/tables").then((r) => r.json()),
      fetch("/api/orders").then((r) => r.json()),
      fetch("/api/products").then((r) => r.json()),
    ]).then(([t, o, p]) => {
      setTables(t);
      setOrders(o);
      setProducts(p);
      setLoading(false);
    });
  };

  useEffect(fetchData, []);

  const activeOrdersForTable = (tableId: string) =>
    orders.filter((o) => o.tableId === tableId && o.status !== "cancelled" && o.status !== "served");

  const openTable = (table: TableInfo) => {
    setSelectedTable(table);
    const active = activeOrdersForTable(table._id);
    setTableOrders(active);
    setOrderOpen(true);
  };

  const openCreate = () => {
    setCreateForm({ paymentMethod: "cash", customerName: "", customerEmail: "", customerPhone: "", observations: "", items: [] });
    setProductSearch("");
    setCreateOpen(true);
  };

  const addItem = (p: any) => {
    setCreateForm((prev) => ({
      ...prev,
      items: [...prev.items, { productId: p._id, name: p.name, price: p.price, quantity: 1 }],
    }));
  };

  const updateItemQty = (idx: number, qty: number) => {
    setCreateForm((prev) => {
      const items = [...prev.items];
      if (qty <= 0) { items.splice(idx, 1); return { ...prev, items }; }
      items[idx] = { ...items[idx], quantity: qty };
      return { ...prev, items };
    });
  };

  const handleCreate = async () => {
    if (!selectedTable) return;
    await fetch("/api/orders", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tableId: selectedTable._id,
        tableLabel: selectedTable.name || selectedTable.tableId,
        items: createForm.items,
        status: "pending",
        observations: createForm.observations,
        paymentMethod: createForm.paymentMethod,
        customer: { name: createForm.customerName, email: createForm.customerEmail, phone: createForm.customerPhone },
        createdBy: session?.user?.name || "Waiter",
      }),
    });
    setCreateOpen(false);
    fetchData();
  };

  const updateStatus = async (orderId: string, status: string) => {
    await fetch(`/api/orders/${orderId}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchData();
  };

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="dashboard-heading text-3xl font-bold tracking-tight">Comanda</h1>
      </div>

      {/* Tables grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {tables.map((t) => {
          const active = activeOrdersForTable(t._id);
          const isBusy = active.length > 0;

          return (
            <button
              key={t._id}
              onClick={() => openTable(t)}
              className={`border-2 rounded-xl p-4 text-center transition-all hover:scale-105 ${
                isBusy
                  ? "border-golden/60 bg-golden/5"
                  : t.status === "maintenance"
                  ? "border-border opacity-40 cursor-not-allowed"
                  : "border-border hover:border-golden/30"
              }`}
            >
              <p className="text-lg font-bold text-foreground">{t.name || t.tableId}</p>
              <p className="text-xs text-muted-foreground">{t.capacity} pax · {t.location}</p>
              {isBusy && (
                <div className="mt-2 space-y-0.5">
                  {active.map((o) => (
                    <p key={o._id} className={`text-xs ${orderStatusColors[o.status]}`}>
                      {o.items.length} items · {o.status}
                    </p>
                  ))}
                </div>
              )}
              {!isBusy && t.status === "available" && (
                <p className="text-xs text-green-500 mt-2">Available</p>
              )}
            </button>
          );
        })}
      </div>

      {/* Table detail dialog */}
      <Dialog open={orderOpen} onOpenChange={setOrderOpen}>
        <DialogContent className="bg-popover sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedTable?.name || selectedTable?.tableId}</DialogTitle>
          </DialogHeader>

          {tableOrders.length === 0 ? (
            <div className="text-center py-8 space-y-4">
              <p className="text-muted-foreground">No active orders for this table</p>
              <Button onClick={() => { setOrderOpen(false); setTimeout(() => { setSelectedTable(selectedTable); openCreate(); }, 100); }} className="gap-2">
                <ImPlus /> New Order
              </Button>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              {tableOrders.map((o) => (
                <div key={o._id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm font-medium capitalize ${orderStatusColors[o.status]}`}>
                      {o.status}
                    </span>
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o._id, e.target.value)}
                      className="text-xs bg-background border border-input rounded px-2 py-1"
                    >
                      <option value="pending">pending</option>
                      <option value="preparing">preparing</option>
                      <option value="ready">ready</option>
                      <option value="served">served</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  </div>

                  <ul className="space-y-1 text-sm">
                    {o.items.map((item, i) => (
                      <li key={i} className="flex justify-between text-muted-foreground">
                        <span>{item.quantity}x {item.name}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex justify-between font-medium text-sm border-t pt-2">
                    <span>Total</span>
                    <span>${o.items.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2)}</span>
                  </div>

                  {o.observations && (
                    <p className="text-xs text-muted-foreground italic">{o.observations}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          <DialogFooter className="gap-2">
            {tableOrders.length > 0 && (
              <Button onClick={() => { setOrderOpen(false); setTimeout(() => openCreate(), 100); }} className="gap-2">
                <ImPlus /> Add Order
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New order dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="bg-popover sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>New Order — {selectedTable?.name || selectedTable?.tableId}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Items</Label>
              <Input placeholder="Search products..." value={productSearch} onChange={(e) => setProductSearch(e.target.value)} />
              <div className="max-h-40 overflow-y-auto border rounded-lg p-2 space-y-1">
                {products
                  .filter((p) => p.name.toLowerCase().includes(productSearch.toLowerCase()))
                  .map((p) => (
                    <div key={p._id} className="flex justify-between items-center text-sm py-1 px-2 hover:bg-accent/50 rounded cursor-pointer"
                      onClick={() => addItem(p)}>
                      <span>{p.name}</span><span className="text-muted-foreground">${p.price}</span>
                    </div>
                  ))}
              </div>
            </div>

            {createForm.items.length > 0 && (
              <div className="grid gap-2 border rounded-lg p-3">
                <Label>Selected Items</Label>
                {createForm.items.map((item, idx) => (
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
                <div className="flex justify-between font-medium pt-2 border-t">
                  <span>Total</span>
                  <span>${createForm.items.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2)}</span>
                </div>
              </div>
            )}

            <div className="grid gap-2">
              <Label>Payment Method</Label>
              <Select value={createForm.paymentMethod} onValueChange={(v) => setCreateForm({ ...createForm, paymentMethod: v })}>
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
                  <Input value={createForm.customerName} onChange={(e) => setCreateForm({ ...createForm, customerName: e.target.value })} />
                </div>
                <div className="grid gap-1">
                  <Label className="text-xs">Email</Label>
                  <Input value={createForm.customerEmail} onChange={(e) => setCreateForm({ ...createForm, customerEmail: e.target.value })} />
                </div>
                <div className="grid gap-1">
                  <Label className="text-xs">Phone</Label>
                  <Input value={createForm.customerPhone} onChange={(e) => setCreateForm({ ...createForm, customerPhone: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Observations</Label>
              <Textarea value={createForm.observations} onChange={(e) => setCreateForm({ ...createForm, observations: e.target.value })} rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)} className="gap-2"><ImCross /> Cancel</Button>
            <Button onClick={handleCreate} disabled={createForm.items.length === 0} className="gap-2"><ImCheckmark /> Create Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
