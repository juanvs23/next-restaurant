"use client";
import { useEffect, useState } from "react";
import { ImPlus, ImBin, ImPencil, ImCross, ImCheckmark } from "react-icons/im";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { useT } from "@/i18n/useT";

export function ChargesTab() {
  const { t } = useT();

  const [charges, setCharges] = useState<any[]>([]);
  const [chargeOpen, setChargeOpen] = useState(false);
  const [editingChargeId, setEditingChargeId] = useState<string | null>(null);
  const [chargeForm, setChargeForm] = useState({
    name: "", type: "percentage" as "percentage" | "fixed", value: 0,
    scope: "global" as "product" | "global",
    categoryIds: [] as string[],
    applyTo: ["subtotal"] as string[],
    appliesToDelivery: false,
    active: true,
  });

  const fetchCharges = () => {
    fetch("/api/charges").then((r) => r.json()).then(setCharges);
  };

  useEffect(() => { fetchCharges(); }, []);

  const openCreateCharge = () => {
    setChargeForm({ name: "", type: "percentage", value: 0, scope: "global", categoryIds: [], applyTo: ["subtotal"], appliesToDelivery: false, active: true });
    setEditingChargeId(null);
    setChargeOpen(true);
  };

  const openEditCharge = (c: any) => {
    setChargeForm({
      name: c.name, type: c.type, value: c.value, scope: c.scope,
      categoryIds: (c.categoryIds || []).map((cat: any) => typeof cat === "string" ? cat : cat._id),
      applyTo: c.applyTo || ["subtotal"],
      appliesToDelivery: c.appliesToDelivery || false,
      active: c.active,
    });
    setEditingChargeId(c._id);
    setChargeOpen(true);
  };

  const saveCharge = async () => {
    const payload = {
      ...chargeForm,
      value: Number(chargeForm.value),
      applyTo: chargeForm.scope === "global" ? chargeForm.applyTo : [],
      categoryIds: chargeForm.scope === "product" ? chargeForm.categoryIds : [],
    };
    await fetch(editingChargeId ? `/api/charges/${editingChargeId}` : "/api/charges", {
      method: editingChargeId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setChargeOpen(false);
    fetchCharges();
  };

  const deleteCharge = async (id: string) => {
    if (!confirm(t("settings.deleteChargeConfirm"))) return;
    await fetch(`/api/charges/${id}`, { method: "DELETE" });
    fetchCharges();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{t("settings.charges")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("settings.chargesHint")}
          </p>
        </div>
        <Button onClick={openCreateCharge} size="sm" className="gap-2"><ImPlus /> {t("settings.addCharge")}</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("common.name")}</TableHead>
            <TableHead>{t("common.type")}</TableHead>
            <TableHead>{t("common.value")}</TableHead>
            <TableHead>{t("settings.scope")}</TableHead>
            <TableHead>{t("settings.applyTo")}</TableHead>
            <TableHead>{t("common.status")}</TableHead>
            <TableHead className="text-right">{t("common.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {charges.map((c: any) => (
            <TableRow key={c._id}>
              <TableCell className="font-medium">{c.name}</TableCell>
              <TableCell className="capitalize">{c.type}</TableCell>
              <TableCell>{c.type === "percentage" ? `${c.value}%` : `$${c.value}`}</TableCell>
              <TableCell className="capitalize">{c.scope}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {c.scope === "global"
                  ? (c.applyTo || ["subtotal"]).join(", ") + (c.appliesToDelivery ? t("settings.deliveryOnly") : "")
                  : t("settings.byProductCategory")}
              </TableCell>
              <TableCell>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  c.active ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                }`}>{c.active ? t("common.active") : t("common.inactive")}</span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => openEditCharge(c)}>
                    <ImPencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteCharge(c._id)}>
                    <ImBin className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {charges.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                {t("settings.noCharges")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={chargeOpen} onOpenChange={setChargeOpen}>
        <DialogContent className="sm:max-w-lg bg-popover">
          <DialogHeader>
            <DialogTitle>{editingChargeId ? t("common.edit") : t("common.new")} {t("settings.charge")}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>{t("common.name")}</Label>
              <Input value={chargeForm.name} onChange={(e) => setChargeForm({ ...chargeForm, name: e.target.value })}
                placeholder="Service 10%, Delivery $5, ..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>{t("common.type")}</Label>
                <Select value={chargeForm.type} onValueChange={(v: "percentage" | "fixed") =>
                  setChargeForm({ ...chargeForm, type: v })
                }>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">{t("settings.percentage")}</SelectItem>
                    <SelectItem value="fixed">{t("settings.fixed")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>{chargeForm.type === "percentage" ? t("settings.rate") : t("settings.amount")}</Label>
                <Input type="number" step="0.01" value={chargeForm.value}
                  onChange={(e) => setChargeForm({ ...chargeForm, value: Number(e.target.value) })} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>{t("settings.scope")}</Label>
              <Select value={chargeForm.scope} onValueChange={(v: "product" | "global") =>
                setChargeForm({ ...chargeForm, scope: v, categoryIds: v === "global" ? [] : chargeForm.categoryIds })
              }>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">{t("settings.global")}</SelectItem>
                  <SelectItem value="product">{t("settings.perProduct")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {chargeForm.scope === "global" && (
              <div className="space-y-3 border rounded-lg p-3">
                <Label className="text-sm font-medium">{t("settings.applyTo")}</Label>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="chApplySub" checked={chargeForm.applyTo.includes("subtotal")}
                    onChange={(e) => {
                      const arr = e.target.checked
                        ? [...chargeForm.applyTo, "subtotal"]
                        : chargeForm.applyTo.filter((a: string) => a !== "subtotal");
                      setChargeForm({ ...chargeForm, applyTo: arr });
                    }} className="rounded" />
                  <Label htmlFor="chApplySub">{t("settings.subtotal")}</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="chDeliverOnly" checked={chargeForm.appliesToDelivery}
                    onChange={(e) => setChargeForm({ ...chargeForm, appliesToDelivery: e.target.checked })} className="rounded" />
                  <Label htmlFor="chDeliverOnly">{t("settings.deliveryOrdersOnly")}</Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("settings.chargeApplyHint")}
                </p>
              </div>
            )}
            <div className="flex items-center gap-2 pt-2">
              <input type="checkbox" id="chActive" checked={chargeForm.active}
                onChange={(e) => setChargeForm({ ...chargeForm, active: e.target.checked })} className="rounded" />
              <Label htmlFor="chActive">{t("common.active")}</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setChargeOpen(false)} className="gap-2"><ImCross /> {t("common.cancel")}</Button>
            <Button onClick={saveCharge} className="gap-2" disabled={!chargeForm.name}><ImCheckmark /> {editingChargeId ? t("common.update") : t("common.create")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
