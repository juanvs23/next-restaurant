"use client";
import { useEffect, useState } from "react";
import { ImPlus, ImPencil, ImBin, ImCheckmark, ImCross } from "react-icons/im";
import { useT } from "@/i18n/useT";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";

interface TableItem {
  _id: string;
  tableId: string;
  name: string;
  capacity: number;
  location: string;
  status: string;
}

const emptyForm = { tableId: "", name: "", capacity: 2, location: "main", status: "available" };

export default function TablesPage() {
  const [tables, setTables] = useState<TableItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;
  const { t } = useT();

  const filtered = tables.filter((t) =>
    t.tableId.toLowerCase().includes(search.toLowerCase()) ||
    (t.name || "").toLowerCase().includes(search.toLowerCase()),
  );
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const fetchTables = () => {
    fetch("/api/backoffice/tables")
      .then((r) => r.json())
      .then((d) => { setTables(d); setLoading(false); });
  };

  useEffect(fetchTables, []);

  const openCreate = () => { setForm({ ...emptyForm }); setEditingId(null); setOpen(true); };

  const openEdit = (t: TableItem) => {
    setForm({ tableId: t.tableId, name: t.name || "", capacity: t.capacity, location: t.location, status: t.status });
    setEditingId(t._id);
    setOpen(true);
  };

  const handleSave = async () => {
    const url = editingId ? `/api/backoffice/tables/${editingId}` : "/api/backoffice/tables";
    const method = editingId ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setOpen(false);
    fetchTables();
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("common.confirmDelete"))) return;
    await fetch(`/api/backoffice/tables/${id}`, { method: "DELETE" });
    fetchTables();
  };

  const statusBadge = (s: string) => {
    const colors: Record<string, string> = {
      available: "bg-green-500/10 text-green-500",
      occupied: "bg-red-500/10 text-red-500",
      reserved: "bg-yellow-500/10 text-yellow-500",
      maintenance: "bg-muted text-muted-foreground",
    };
    return colors[s] || "bg-muted text-muted-foreground";
  };

  if (loading) return <p className="text-muted-foreground">{t("common.loading")}</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="dashboard-heading text-3xl font-bold tracking-tight">{t("tables.title")}</h1>
        <Button onClick={openCreate} className="gap-2"><ImPlus /> {t("tables.add")}</Button>
      </div>

      <Input
        placeholder={t("common.search")}
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        className="max-w-xs"
      />

      <Card>
        <CardHeader><CardTitle>{t("tables.allTables")}</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Table ID</TableHead>
                <TableHead>{t("common.name")}</TableHead>
                <TableHead>{t("tables.capacity")}</TableHead>
                <TableHead>{t("tables.location")}</TableHead>
                <TableHead>{t("common.status")}</TableHead>
                <TableHead className="text-right">{t("common.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((t) => (
                <TableRow key={t._id}>
                  <TableCell className="font-mono text-sm">{t.tableId}</TableCell>
                  <TableCell>{t.name || "—"}</TableCell>
                  <TableCell>{t.capacity}</TableCell>
                  <TableCell className="capitalize">{t.location}</TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-0.5 rounded ${statusBadge(t.status)}`}>
                      {t.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(t)}>
                        <ImPencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(t._id)}>
                        <ImBin className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filtered.length} {t("products.results")}
          {totalPages > 1 && ` · ${t("products.pageOf")} ${page} of ${totalPages}`}
        </p>
        {totalPages > 1 && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-popover">
          <DialogHeader><DialogTitle>{editingId ? t("tables.edit") : "New Table"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="grid gap-2">
              <Label>Table ID</Label>
              <Input value={form.tableId} onChange={(e) => setForm({ ...form, tableId: e.target.value })} placeholder="T1" />
            </div>
            <div className="grid gap-2">
              <Label>{t("common.name")}</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Window 1" />
            </div>
            <div className="grid gap-2">
              <Label>{t("tables.capacity")}</Label>
              <Input type="number" min={1} value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} />
            </div>
            <div className="grid gap-2">
              <Label>{t("tables.location")}</Label>
              <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="main, terrace, bar..." />
            </div>
            <div className="col-span-2 grid gap-2">
              <Label>{t("common.status")}</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} className="gap-2"><ImCross /> {t("common.cancel")}</Button>
            <Button onClick={handleSave} className="gap-2"><ImCheckmark /> {editingId ? t("common.update") : t("common.create")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
