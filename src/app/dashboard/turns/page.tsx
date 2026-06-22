"use client";
import { useEffect, useState } from "react";
import { ImPlus, ImPencil, ImBin, ImCheckmark, ImCross } from "react-icons/im";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";

interface TurnItem {
  _id: string;
  name: string;
  label: string;
  startTime: string;
  endTime: string;
  sortOrder: number;
  active: boolean;
  color: string;
}

const emptyForm = { name: "", label: "", startTime: "", endTime: "", sortOrder: 0, active: true, color: "#DCCA87" };

export default function TurnsPage() {
  const [items, setItems] = useState<TurnItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });

  const loadTurns = () => fetch("/api/turns").then(r => r.json()).then(d => { setItems(d); setLoading(false); });
  useEffect(loadTurns, []);

  const openCreate = () => { setForm({ ...emptyForm }); setEditingId(null); setOpen(true); };
  const openEdit = (t: TurnItem) => { setForm(t); setEditingId(t._id); setOpen(true); };

  const handleSave = async () => {
    const url = editingId ? `/api/turns/${editingId}` : "/api/turns";
    await fetch(url, {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setOpen(false); loadTurns();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this turn?")) return;
    await fetch(`/api/turns/${id}`, { method: "DELETE" }); loadTurns();
  };

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="dashboard-heading text-3xl font-bold tracking-tight">Turns</h1>
        <Button onClick={openCreate} className="gap-2"><ImPlus /> Add Turn</Button>
      </div>
      <Card>
        <CardHeader><CardTitle>Service Hours</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Color</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Label</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((t) => (
                <TableRow key={t._id} className={!t.active ? "opacity-50" : ""}>
                  <TableCell>
                    <div className="w-6 h-6 rounded border" style={{ backgroundColor: t.color }} />
                  </TableCell>
                  <TableCell className="font-medium capitalize">{t.name}</TableCell>
                  <TableCell>{t.label}</TableCell>
                  <TableCell className="font-mono text-sm">{t.startTime} – {t.endTime}</TableCell>
                  <TableCell>{t.sortOrder}</TableCell>
                  <TableCell>{t.active ? "Yes" : "No"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(t)}><ImPencil /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(t._id)}><ImBin className="text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-popover">
          <DialogHeader><DialogTitle>{editingId ? "Edit" : "New"} Turn</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="morning" />
            </div>
            <div className="grid gap-2">
              <Label>Label</Label>
              <Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Breakfast" />
            </div>
            <div className="grid gap-2">
              <Label>Start Time</Label>
              <Input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label>End Time</Label>
              <Input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label>Sort Order</Label>
              <Input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
            </div>
            <div className="grid gap-2">
              <Label>Color</Label>
              <div className="flex gap-2 items-center">
                <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="w-10 h-10 rounded cursor-pointer" />
                <span className="text-xs text-muted-foreground font-mono">{form.color}</span>
              </div>
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} id="active" />
              <Label htmlFor="active">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} className="gap-2"><ImCross /> Cancel</Button>
            <Button onClick={handleSave} className="gap-2"><ImCheckmark /> {editingId ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
