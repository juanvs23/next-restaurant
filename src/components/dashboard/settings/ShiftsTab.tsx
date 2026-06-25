"use client";
import { useEffect, useState } from "react";
import { ImPlus, ImBin, ImPencil, ImCross, ImCheckmark } from "react-icons/im";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { useT } from "@/i18n/useT";

export function ShiftsTab() {
  const { t } = useT();

  const [workShifts, setWorkShifts] = useState<any[]>([]);
  const [wsOpen, setWsOpen] = useState(false);
  const [editingWsId, setEditingWsId] = useState<string | null>(null);
  const [wsForm, setWsForm] = useState({
    name: "", startTime: "08:00", endTime: "16:00", active: true, sortOrder: 0,
  });

  const fetchWorkShifts = () => {
    fetch("/api/work-shifts").then((r) => r.json()).then(setWorkShifts);
  };

  useEffect(() => { fetchWorkShifts(); }, []);

  const openCreateWs = () => {
    setWsForm({ name: "", startTime: "08:00", endTime: "16:00", active: true, sortOrder: workShifts.length });
    setEditingWsId(null);
    setWsOpen(true);
  };

  const openEditWs = (ws: any) => {
    setWsForm({ name: ws.name, startTime: ws.startTime, endTime: ws.endTime, active: ws.active, sortOrder: ws.sortOrder });
    setEditingWsId(ws._id);
    setWsOpen(true);
  };

  const saveWs = async () => {
    const payload = { ...wsForm, sortOrder: Number(wsForm.sortOrder) };
    await fetch(editingWsId ? `/api/work-shifts/${editingWsId}` : "/api/work-shifts", {
      method: editingWsId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setWsOpen(false);
    fetchWorkShifts();
  };

  const deleteWs = async (id: string) => {
    if (!confirm(t("settings.deleteWorkShiftConfirm"))) return;
    await fetch(`/api/work-shifts/${id}`, { method: "DELETE" });
    fetchWorkShifts();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{t("settings.shifts")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("settings.shiftsHint")}
          </p>
        </div>
        <Button onClick={openCreateWs} size="sm" className="gap-2"><ImPlus /> {t("settings.addShift")}</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("common.name")}</TableHead>
            <TableHead>{t("settings.startTime")}</TableHead>
            <TableHead>{t("settings.endTime")}</TableHead>
            <TableHead>{t("common.status")}</TableHead>
            <TableHead className="text-right">{t("common.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workShifts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                {t("settings.noShifts")}
              </TableCell>
            </TableRow>
          ) : (
            workShifts.map((ws: any) => (
              <TableRow key={ws._id}>
                <TableCell className="font-medium">{ws.name}</TableCell>
                <TableCell>{ws.startTime}</TableCell>
                <TableCell>{ws.endTime}</TableCell>
                <TableCell>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    ws.active ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                  }`}>{ws.active ? t("common.active") : t("common.inactive")}</span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditWs(ws)}>
                      <ImPencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteWs(ws._id)}>
                      <ImBin className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={wsOpen} onOpenChange={setWsOpen}>
        <DialogContent className="sm:max-w-sm bg-popover">
          <DialogHeader><DialogTitle>{editingWsId ? t("common.edit") : t("common.new")} {t("settings.shift")}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>{t("common.name")}</Label>
              <Input value={wsForm.name} onChange={(e) => setWsForm({ ...wsForm, name: e.target.value })}
                placeholder="Morning, Afternoon, Night" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>{t("settings.startTime")}</Label>
                <Input type="time" value={wsForm.startTime}
                  onChange={(e) => setWsForm({ ...wsForm, startTime: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>{t("settings.endTime")}</Label>
                <Input type="time" value={wsForm.endTime}
                  onChange={(e) => setWsForm({ ...wsForm, endTime: e.target.value })} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="wsActive" checked={wsForm.active}
                onChange={(e) => setWsForm({ ...wsForm, active: e.target.checked })} className="rounded" />
              <Label htmlFor="wsActive">{t("common.active")}</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWsOpen(false)} className="gap-2"><ImCross /> {t("common.cancel")}</Button>
            <Button onClick={saveWs} className="gap-2" disabled={!wsForm.name.trim()}><ImCheckmark /> {editingWsId ? t("common.update") : t("common.create")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
