"use client";
import { useEffect, useState } from "react";
import { ImPlus, ImPencil, ImBin, ImCheckmark, ImCross } from "react-icons/im";
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
import { Badge } from "@/components/ui/badge";
import { useT } from "@/i18n/useT";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  provider?: string;
}

const emptyCreate = { name: "", email: "", role: "staff" as string };

const roleBadge = (role: string) => {
  const map: Record<string, string> = {
    admin: "bg-primary/10 text-primary",
    staff: "bg-blue-500/10 text-blue-500",
    user: "bg-muted text-muted-foreground",
  };
  return map[role] || map.user;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useT();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState({ ...emptyCreate });
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "", password: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<{ id: string; name: string; active: boolean } | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()),
  );
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const fetchUsers = () => {
    fetch("/api/backoffice/users")
      .then((r) => r.json())
      .then((d) => { setUsers(d); setLoading(false); });
  };

  useEffect(fetchUsers, []);

  const openCreate = () => { setForm({ ...emptyCreate }); setCreateOpen(true); };

  const openEdit = (u: User) => {
    setEditId(u._id);
    setEditForm({ name: u.name, email: u.email, role: u.role, password: "" });
    setEditOpen(true);
  };

  const handleCreate = async () => {
    await fetch("/api/backoffice/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setCreateOpen(false);
    fetchUsers();
  };

  const handleEdit = async () => {
    if (!editId) return;
    const payload: any = { name: editForm.name, email: editForm.email, role: editForm.role };
    if (editForm.password) payload.password = editForm.password;
    await fetch(`/api/backoffice/users/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setEditOpen(false);
    fetchUsers();
  };

  const toggleActive = async (id: string, current: boolean) => {
    await fetch(`/api/backoffice/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !current }),
    });
    fetchUsers();
  };

  const updateRole = async (id: string, role: string) => {
    await fetch(`/api/backoffice/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    fetchUsers();
  };

  if (loading) return <p className="text-muted-foreground">{t("common.loading")}</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="dashboard-heading text-3xl font-bold tracking-tight">{t("users.title")}</h1>
        <Button onClick={openCreate} className="gap-2"><ImPlus /> Add User</Button>
      </div>

      <Input
        placeholder={t("users.searchByEmail")}
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        className="max-w-xs"
      />

      <Card>
        <CardHeader><CardTitle>{t("users.allUsers")}</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("common.name")}</TableHead>
                <TableHead>{t("users.email")}</TableHead>
                <TableHead>{t("users.provider")}</TableHead>
                <TableHead>{t("users.role")}</TableHead>
                <TableHead>{t("common.status")}</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((u) => (
                <TableRow key={u._id} className={!u.active ? "opacity-50" : ""}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell className="text-muted-foreground">{u.email}</TableCell>
                  <TableCell>
                    <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground capitalize">
                      {u.provider || "—"}
                    </span>
                  </TableCell>
                  <TableCell><Badge variant="outline" className={roleBadge(u.role)}>{u.role}</Badge></TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      u.active ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                    }`}>
                      {u.active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2 items-center">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(u)} title="Edit user">
                        <ImPencil className="w-4 h-4" />
                      </Button>
                      <select
                        value={u.role}
                        onChange={(e) => updateRole(u._id, e.target.value)}
                        className="bg-background border border-input rounded px-2 py-1 text-sm"
                      >
                        <option value="user">user</option>
                        <option value="staff">staff</option>
                        <option value="admin">admin</option>
                      </select>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setConfirmTarget({ id: u._id, name: u.name, active: u.active });
                          setConfirmOpen(true);
                        }}
                        title={u.active ? "Deactivate user" : "Activate user"}
                      >
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
          {filtered.length} {t("users.results")}
          {totalPages > 1 && ` · ${t("users.pageOf")} ${page} of ${totalPages}`}
        </p>
        {totalPages > 1 && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>{t("common.previous")}</Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>{t("common.next")}</Button>
          </div>
        )}
      </div>

      {/* Create User Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="bg-popover">
          <DialogHeader><DialogTitle>New User</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>{t("common.name")}</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label>{t("users.email")}</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label>{t("users.role")}</Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">{t("users.user")}</SelectItem>
                  <SelectItem value="staff">{t("users.staff")}</SelectItem>
                  <SelectItem value="admin">{t("users.admin")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)} className="gap-2"><ImCross /> Cancel</Button>
            <Button onClick={handleCreate} className="gap-2"><ImCheckmark /> Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="bg-popover">
          <DialogHeader><DialogTitle>Edit User</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>{t("common.name")}</Label>
              <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label>{t("users.email")}</Label>
              <Input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label>{t("users.role")}</Label>
              <Select value={editForm.role} onValueChange={(v) => setEditForm({ ...editForm, role: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">{t("users.user")}</SelectItem>
                  <SelectItem value="staff">{t("users.staff")}</SelectItem>
                  <SelectItem value="admin">{t("users.admin")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>New Password</Label>
              <Input type="password" value={editForm.password}
                onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                placeholder="Leave blank to keep current" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)} className="gap-2"><ImCross /> Cancel</Button>
            <Button onClick={handleEdit} className="gap-2"><ImCheckmark /> Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Deactivate/Activate Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="bg-popover sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{confirmTarget?.active ? "Deactivate User" : "Activate User"}</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground py-4">
            Are you sure you want to {confirmTarget?.active ? "deactivate" : "activate"}{" "}
            <strong>{confirmTarget?.name}</strong>?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)} className="gap-2">
              <ImCross /> Cancel
            </Button>
            <Button
              variant={confirmTarget?.active ? "destructive" : "default"}
              onClick={() => {
                if (confirmTarget) toggleActive(confirmTarget.id, confirmTarget.active);
                setConfirmOpen(false);
              }}
              className="gap-2"
            >
              <ImCheckmark /> Yes, {confirmTarget?.active ? "deactivate" : "activate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
