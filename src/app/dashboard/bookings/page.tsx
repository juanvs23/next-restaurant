"use client";
import { useEffect, useState } from "react";
import { ImPlus, ImPencil, ImCheckmark, ImCross } from "react-icons/im";
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

interface Booking {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateTime: string;
  turnTime: string;
  numberPersons: number;
  arrivalTime?: string;
  departureTime?: string;
  comments?: string;
  status: string;
  tableId?: any;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-500",
  confirmed: "bg-green-500/10 text-green-500",
  cancelled: "bg-red-500/10 text-red-500",
  completed: "bg-blue-500/10 text-blue-500",
};

const emptyForm = {
  firstName: "", lastName: "", email: "", phoneNumber: "",
  dateTime: "", turnTime: "evening", numberPersons: "2",
  arrivalTime: "", departureTime: "", comments: "", status: "confirmed",
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });

  const fetchBookings = () => {
    fetch("/api/bookings")
      .then((r) => r.json())
      .then((d) => { setBookings(d); setLoading(false); });
  };

  useEffect(fetchBookings, []);

  const openCreate = () => { setForm({ ...emptyForm }); setEditingId(null); setOpen(true); };

  const openEdit = (b: Booking) => {
    setForm({
      firstName: b.firstName, lastName: b.lastName, email: b.email,
      phoneNumber: b.phoneNumber || "", dateTime: b.dateTime.slice(0, 16),
      turnTime: b.turnTime, numberPersons: String(b.numberPersons),
      arrivalTime: b.arrivalTime || "", departureTime: b.departureTime || "",
      comments: b.comments || "", status: b.status,
    });
    setEditingId(b._id);
    setOpen(true);
  };

  const handleSave = async () => {
    const payload = { ...form, numberPersons: Number(form.numberPersons) };
    const url = editingId ? `/api/bookings/${editingId}` : "/api/bookings";
    const method = editingId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setOpen(false);
    fetchBookings();
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchBookings();
  };

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="dashboard-heading text-3xl font-bold tracking-tight">Bookings</h1>
        <Button onClick={openCreate} className="gap-2"><ImPlus /> Add Booking</Button>
      </div>

      <div className="grid gap-4">
        {bookings.map((b) => (
          <Card key={b._id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{b.firstName} {b.lastName}</CardTitle>
                  <p className="text-xs text-muted-foreground">{b.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={b.status}
                    onChange={(e) => updateStatus(b._id, e.target.value)}
                    className={`text-xs px-2 py-1 rounded border-none cursor-pointer font-medium ${
                      statusColors[b.status] || "bg-muted text-muted-foreground"
                    }`}
                  >
                    <option value="pending">pending</option>
                    <option value="confirmed">confirmed</option>
                    <option value="completed">completed</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(b)}>
                    <ImPencil className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-muted-foreground">
              <p>{new Date(b.dateTime).toLocaleString()} · {b.numberPersons} guests</p>
              {(b.arrivalTime || b.departureTime) && (
                <p>
                  {b.arrivalTime && <><span className="text-foreground">Arrival:</span> {b.arrivalTime} </>}
                  {b.departureTime && <><span className="text-foreground">Departure:</span> {b.departureTime}</>}
                </p>
              )}
              {b.comments && <p className="italic">&ldquo;{b.comments}&rdquo;</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-popover sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingId ? "Edit" : "New"} Booking</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>First Name</Label>
                <Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Last Name</Label>
                <Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Phone</Label>
                <Input value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Date & Time</Label>
              <Input type="datetime-local" value={form.dateTime}
                onChange={(e) => setForm({ ...form, dateTime: e.target.value })} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label>Turn</Label>
                <Select value={form.turnTime} onValueChange={(v) => setForm({ ...form, turnTime: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning</SelectItem>
                    <SelectItem value="afternoon">Afternoon</SelectItem>
                    <SelectItem value="evening">Evening</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Arrival</Label>
                <Input type="time" value={form.arrivalTime}
                  onChange={(e) => setForm({ ...form, arrivalTime: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Departure</Label>
                <Input type="time" value={form.departureTime}
                  onChange={(e) => setForm({ ...form, departureTime: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Guests</Label>
                <Input type="number" min={1} value={form.numberPersons}
                  onChange={(e) => setForm({ ...form, numberPersons: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Comments</Label>
              <Input value={form.comments} onChange={(e) => setForm({ ...form, comments: e.target.value })} />
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
