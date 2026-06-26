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

export function PaymentsTab() {
  const { t } = useT();

  const [pmMethods, setPmMethods] = useState<any[]>([]);
  const [pmOpen, setPmOpen] = useState(false);
  const [editingPmId, setEditingPmId] = useState<string | null>(null);
  const [pmForm, setPmForm] = useState({
    type: "cash" as string, label: "", active: true, sortOrder: 0,
    fields: [] as { key: string; label: string; type: string; options?: string[]; required: boolean; placeholder?: string }[],
  });
  const [pmError, setPmError] = useState("");

  // Cash register state
  const [registers, setRegisters] = useState<any[]>([]);
  const [regOpen, setRegOpen] = useState(false);
  const [editingRegId, setEditingRegId] = useState<string | null>(null);
  const [regForm, setRegForm] = useState({ name: "", active: true, sortOrder: 0 });

  const fetchPaymentMethods = () => {
    fetch("/api/backoffice/payment-methods").then((r) => r.json()).then(setPmMethods);
  };

  const fetchRegisters = () => {
    fetch("/api/backoffice/cash-registers").then((r) => r.json()).then(setRegisters);
  };

  useEffect(() => { fetchPaymentMethods(); fetchRegisters(); }, []);

  const openCreatePm = () => {
    setPmForm({ type: "cash", label: "", active: true, sortOrder: pmMethods.length, fields: [] });
    setEditingPmId(null);
    setPmError("");
    setPmOpen(true);
  };

  const openEditPm = (pm: any) => {
    setPmForm({
      type: pm.type, label: pm.label, active: pm.active, sortOrder: pm.sortOrder,
      fields: (pm.fields || []).map((f: any) => ({
        key: f.key, label: f.label, type: f.type,
        options: f.options || [], required: f.required,
        placeholder: f.placeholder || "",
      })),
    });
    setEditingPmId(pm._id);
    setPmError("");
    setPmOpen(true);
  };

  const savePm = async () => {
    setPmError("");
    if (!pmForm.label.trim()) { setPmError(t("settings.labelRequired")); return; }
    const payload = { ...pmForm, label: pmForm.label.trim() };
    const res = await fetch(editingPmId ? `/api/backoffice/payment-methods/${editingPmId}` : "/api/backoffice/payment-methods", {
      method: editingPmId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      setPmError(err.error || t("settings.failedToSave"));
      return;
    }
    setPmOpen(false);
    fetchPaymentMethods();
  };

  const deletePm = async (id: string) => {
    if (!confirm(t("settings.deletePaymentMethodConfirm"))) return;
    const res = await fetch(`/api/backoffice/payment-methods/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json();
      alert(err.error);
    }
    fetchPaymentMethods();
  };

  const addPmField = () => {
    setPmForm({
      ...pmForm,
      fields: [...pmForm.fields, { key: "", label: "", type: "text", required: false, placeholder: "" }],
    });
  };

  const removePmField = (idx: number) => {
    setPmForm({ ...pmForm, fields: pmForm.fields.filter((_, i) => i !== idx) });
  };

  const updatePmField = (idx: number, updates: any) => {
    const fields = [...pmForm.fields];
    fields[idx] = { ...fields[idx], ...updates };
    setPmForm({ ...pmForm, fields });
  };

  // Cash register CRUD
  const openCreateReg = () => {
    setRegForm({ name: "", active: true, sortOrder: registers.length });
    setEditingRegId(null);
    setRegOpen(true);
  };
  const openEditReg = (r: any) => {
    setRegForm({ name: r.name, active: r.active, sortOrder: r.sortOrder });
    setEditingRegId(r._id);
    setRegOpen(true);
  };
  const saveReg = async () => {
    await fetch(editingRegId ? `/api/backoffice/cash-registers/${editingRegId}` : "/api/backoffice/cash-registers", {
      method: editingRegId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(regForm),
    });
    setRegOpen(false);
    fetchRegisters();
  };
  const deleteReg = async (id: string) => {
    if (!confirm(t("common.confirmDelete"))) return;
    await fetch(`/api/backoffice/cash-registers/${id}`, { method: "DELETE" });
    fetchRegisters();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{t("settings.paymentMethods")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("settings.paymentMethodsHint")}
          </p>
        </div>
        <Button onClick={openCreatePm} size="sm" className="gap-2"><ImPlus /> {t("settings.addPaymentMethod")}</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("common.label")}</TableHead>
            <TableHead>{t("settings.internalType")}</TableHead>
            <TableHead>{t("settings.sortOrder")}</TableHead>
            <TableHead>{t("common.status")}</TableHead>
            <TableHead className="text-right">{t("common.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pmMethods.map((pm: any) => (
            <TableRow key={pm._id}>
              <TableCell className="font-medium">{pm.label}</TableCell>
              <TableCell className="text-xs text-muted-foreground font-mono">{pm.type}</TableCell>
              <TableCell className="text-xs text-muted-foreground">{pm.sortOrder}</TableCell>
              <TableCell>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  pm.active ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                }`}>{pm.active ? t("common.active") : t("common.inactive")}</span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => openEditPm(pm)}>
                    <ImPencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deletePm(pm._id)}>
                    <ImBin className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {pmMethods.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                {t("common.loading")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Cash Registers */}
      <div className="border-t pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{t("settings.cashRegister")}</h3>
            <p className="text-sm text-muted-foreground">{t("settings.cashRegisterHint") || "Manage point-of-sale registers"}</p>
          </div>
          <Button onClick={openCreateReg} size="sm" className="gap-2"><ImPlus /> {t("common.add")}</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("common.name")}</TableHead>
              <TableHead>{t("settings.sortOrder")}</TableHead>
              <TableHead>{t("common.status")}</TableHead>
              <TableHead className="text-right">{t("common.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registers.map((r: any) => (
              <TableRow key={r._id}>
                <TableCell className="font-medium">{r.name}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{r.sortOrder}</TableCell>
                <TableCell>
                  <span className={`text-xs px-2 py-0.5 rounded ${r.active ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                    {r.active ? t("common.active") : t("common.inactive")}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditReg(r)}><ImPencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteReg(r._id)}><ImBin className="w-4 h-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {registers.length === 0 && (
              <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-4">{t("common.noData")}</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Register dialog */}
      <Dialog open={regOpen} onOpenChange={setRegOpen}>
        <DialogContent className="sm:max-w-sm bg-popover">
          <DialogHeader><DialogTitle>{editingRegId ? t("common.edit") : t("common.new")} {t("settings.cashRegister")}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>{t("common.name")}</Label>
              <Input value={regForm.name} onChange={(e) => setRegForm({ ...regForm, name: e.target.value })} placeholder="Caja 1, POS Principal, ..." />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="regActive" checked={regForm.active}
                onChange={(e) => setRegForm({ ...regForm, active: e.target.checked })} className="rounded" />
              <Label htmlFor="regActive">{t("common.active")}</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRegOpen(false)} className="gap-2"><ImCross /> {t("common.cancel")}</Button>
            <Button onClick={saveReg} className="gap-2" disabled={!regForm.name.trim()}><ImCheckmark /> {editingRegId ? t("common.update") : t("common.create")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={pmOpen} onOpenChange={setPmOpen}>
        <DialogContent className="sm:max-w-lg bg-popover max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingPmId ? t("common.edit") : t("common.new")} {t("settings.paymentMethod")}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            {pmError && (
              <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded">{pmError}</div>
            )}

            <div className="grid gap-2">
              <Label>{t("settings.internalType")}</Label>
              {editingPmId ? (
                <p className="text-sm font-mono text-muted-foreground bg-muted px-3 py-2 rounded">{pmForm.type}</p>
              ) : (
                <Select value={pmForm.type} onValueChange={(v) => setPmForm({ ...pmForm, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">{t("settings.pmCash")}</SelectItem>
                    <SelectItem value="debit">{t("settings.pmDebit")}</SelectItem>
                    <SelectItem value="credit">{t("settings.pmCredit")}</SelectItem>
                    <SelectItem value="transfer">{t("settings.pmTransfer")}</SelectItem>
                    <SelectItem value="pago-movil">{t("settings.pmPagoMovil")}</SelectItem>
                    <SelectItem value="invoice">{t("settings.pmInvoice")}</SelectItem>
                    <SelectItem value="other">{t("settings.pmOther")}</SelectItem>
                  </SelectContent>
                </Select>
              )}
              <p className="text-xs text-muted-foreground">
                {t("settings.internalTypeHint")}
              </p>
            </div>

            <div className="grid gap-2">
              <Label>{t("settings.displayLabel")}</Label>
              <Input value={pmForm.label} onChange={(e) => setPmForm({ ...pmForm, label: e.target.value })}
                placeholder="Cash, Tarjeta de Débito, ..." />
            </div>

            <div className="grid gap-2">
              <Label>{t("settings.sortOrder")}</Label>
              <Input type="number" value={pmForm.sortOrder}
                onChange={(e) => setPmForm({ ...pmForm, sortOrder: Number(e.target.value) })} />
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="pmActive" checked={pmForm.active}
                onChange={(e) => setPmForm({ ...pmForm, active: e.target.checked })} className="rounded" />
              <Label htmlFor="pmActive">{t("common.active")}</Label>
            </div>

            <div className="border-t pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">{t("settings.paymentDataFields")}</Label>
                <Button variant="outline" size="sm" onClick={addPmField} className="gap-1"><ImPlus className="w-3 h-3" /> {t("settings.addField")}</Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {t("settings.paymentFieldsHint")}
              </p>

              {pmForm.fields.length === 0 && (
                <p className="text-xs text-muted-foreground py-2">{t("settings.noPaymentFields")}</p>
              )}

              {pmForm.fields.map((f, i) => (
                <div key={i} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">{t("settings.field")} #{i + 1}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removePmField(i)}>
                      <ImCross className="w-2 h-2" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="grid gap-1">
                      <Label className="text-xs">{t("settings.fieldKey")}</Label>
                      <Input className="h-8 text-xs" value={f.key}
                        onChange={(e) => updatePmField(i, { key: e.target.value })}
                        placeholder="reference" />
                    </div>
                    <div className="grid gap-1">
                      <Label className="text-xs">{t("common.label")}</Label>
                      <Input className="h-8 text-xs" value={f.label}
                        onChange={(e) => updatePmField(i, { label: e.target.value })}
                        placeholder="Reference" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="grid gap-1">
                      <Label className="text-xs">{t("common.type")}</Label>
                      <select value={f.type} onChange={(e) => updatePmField(i, { type: e.target.value })}
                        className="bg-background border border-input rounded h-8 text-xs px-2">
                        <option value="text">{t("settings.fieldTypeText")}</option>
                        <option value="number">{t("settings.fieldTypeNumber")}</option>
                        <option value="select">{t("settings.fieldTypeSelect")}</option>
                        <option value="time">{t("settings.fieldTypeTime")}</option>
                      </select>
                    </div>
                    <div className="flex items-end gap-2 pb-1">
                      <input type="checkbox" id={`req-${i}`} checked={f.required}
                        onChange={(e) => updatePmField(i, { required: e.target.checked })} className="rounded" />
                      <Label htmlFor={`req-${i}`} className="text-xs">{t("common.required")}</Label>
                    </div>
                  </div>
                  {f.type === "select" && (
                    <div className="grid gap-1">
                      <Label className="text-xs">{t("settings.options")}</Label>
                      <Input className="h-8 text-xs" value={(f.options || []).join(", ")}
                        onChange={(e) => updatePmField(i, { options: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                        placeholder="Visa, Mastercard, Amex" />
                    </div>
                  )}
                  <div className="grid gap-1">
                    <Label className="text-xs">{t("common.placeholder")}</Label>
                    <Input className="h-8 text-xs" value={f.placeholder || ""}
                      onChange={(e) => updatePmField(i, { placeholder: e.target.value })}
                      placeholder={t("settings.placeholderHint")} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPmOpen(false)} className="gap-2"><ImCross /> {t("common.cancel")}</Button>
            <Button onClick={savePm} className="gap-2" disabled={!pmForm.label.trim()}><ImCheckmark /> {editingPmId ? t("common.update") : t("common.create")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
