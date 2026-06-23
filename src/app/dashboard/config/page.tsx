"use client";
import { useEffect, useState } from "react";
import { ImPlus, ImBin, ImCheckmark } from "react-icons/im";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const tabs = ["General", "Tax", "Charges", "Payments", "Hours"];

export default function ConfigPage() {
  const [config, setConfig] = useState<any>(null);
  const [form, setForm] = useState<any>({});
  const [tab, setTab] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then((d) => {
        setConfig(d);
        setForm({
          businessName: d.businessName || "",
          rif: d.rif || "",
          businessAddress: d.businessAddress || "",
          businessPhone: d.businessPhone || "",
          businessEmail: d.businessEmail || "",
          taxRate: d.taxRate ?? 0,
          serviceChargeTaxable: d.serviceChargeTaxable ?? false,
          serviceChargeRate: d.serviceChargeRate ?? 0.1,
          defaultDeliveryCost: d.defaultDeliveryCost ?? 5,
          paymentMethods: d.paymentMethods ?? ["cash", "card"],
          nonWorkingDays: d.nonWorkingDays ?? [0],
          holidays: d.holidays ?? [],
          defaultLanguage: d.defaultLanguage ?? "es",
          nextInvoiceNumber: d.nextInvoiceNumber ?? 1,
        });
      });
  }, []);

  const togglePayment = (method: string) => {
    const methods = form.paymentMethods || [];
    setForm({
      ...form,
      paymentMethods: methods.includes(method)
        ? methods.filter((m: string) => m !== method)
        : [...methods, method],
    });
  };

  const addHoliday = () => {
    setForm({ ...form, holidays: [...(form.holidays || []), ""] });
  };

  const removeHoliday = (idx: number) => {
    setForm({ ...form, holidays: (form.holidays || []).filter((_: any, i: number) => i !== idx) });
  };

  const updateHoliday = (idx: number, val: string) => {
    const items = [...(form.holidays || [])];
    items[idx] = val;
    setForm({ ...form, holidays: items });
  };

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!config) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-6">
      <h1 className="dashboard-heading text-3xl font-bold tracking-tight">Settings</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
        {tabs.map((t, i) => (
          <button key={t} onClick={() => setTab(i)}
            className={`px-4 py-1.5 text-sm rounded-md transition-colors ${
              tab === i ? "bg-background text-foreground shadow-sm font-medium" : "text-muted-foreground hover:text-foreground"
            }`}>
            {t}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>{tabs[tab]}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {/* General */}
          {tab === 0 && (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 grid gap-1">
                <Label>Business Name (Razón Social)</Label>
                <Input value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} />
              </div>
              <div className="grid gap-1">
                <Label>RIF</Label>
                <Input value={form.rif} onChange={(e) => setForm({ ...form, rif: e.target.value })} placeholder="J-12345678-9" />
              </div>
              <div className="grid gap-1">
                <Label>Phone</Label>
                <Input value={form.businessPhone} onChange={(e) => setForm({ ...form, businessPhone: e.target.value })} />
              </div>
              <div className="col-span-2 grid gap-1">
                <Label>Address</Label>
                <Input value={form.businessAddress} onChange={(e) => setForm({ ...form, businessAddress: e.target.value })} />
              </div>
              <div className="col-span-2 grid gap-1">
                <Label>Email (fiscal)</Label>
                <Input value={form.businessEmail} onChange={(e) => setForm({ ...form, businessEmail: e.target.value })} />
              </div>
              <div className="grid gap-1">
                <Label>Default Language</Label>
                <select value={form.defaultLanguage} onChange={(e) => setForm({ ...form, defaultLanguage: e.target.value })}
                  className="bg-background border border-input rounded px-3 py-2 text-sm">
                  <option value="es">Español</option>
                  <option value="en">English</option>
                  <option value="pt">Português</option>
                </select>
              </div>
            </div>
          )}

          {/* Tax */}
          {tab === 1 && (
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1">
                <Label>IVA Rate (%)</Label>
                <Input type="number" step="0.01" value={form.taxRate * 100}
                  onChange={(e) => setForm({ ...form, taxRate: Number(e.target.value) / 100 })} />
                <p className="text-xs text-muted-foreground">Current: {(form.taxRate * 100).toFixed(2)}%</p>
              </div>
              <div className="grid gap-1">
                <Label>Next Invoice #</Label>
                <Input type="number" value={form.nextInvoiceNumber}
                  onChange={(e) => setForm({ ...form, nextInvoiceNumber: Number(e.target.value) })} />
              </div>
              <div className="col-span-2 flex items-center gap-2 pt-2">
                <input type="checkbox" id="taxable" checked={form.serviceChargeTaxable}
                  onChange={(e) => setForm({ ...form, serviceChargeTaxable: e.target.checked })} className="rounded" />
                <Label htmlFor="taxable">Service charge (10%) is taxable</Label>
              </div>
            </div>
          )}

          {/* Charges */}
          {tab === 2 && (
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1">
                <Label>Service Charge (%)</Label>
                <Input type="number" step="0.01" value={form.serviceChargeRate * 100}
                  onChange={(e) => setForm({ ...form, serviceChargeRate: Number(e.target.value) / 100 })} />
              </div>
              <div className="grid gap-1">
                <Label>Default Delivery Cost ($)</Label>
                <Input type="number" step="0.5" value={form.defaultDeliveryCost}
                  onChange={(e) => setForm({ ...form, defaultDeliveryCost: Number(e.target.value) })} />
              </div>
            </div>
          )}

          {/* Payments */}
          {tab === 3 && (
            <div className="space-y-3">
              <Label>Enabled Payment Methods</Label>
              {["cash", "card", "transfer", "invoice"].map((m) => (
                <div key={m} className="flex items-center gap-2">
                  <input type="checkbox" id={m} checked={(form.paymentMethods || []).includes(m)}
                    onChange={() => togglePayment(m)} className="rounded" />
                  <Label htmlFor={m} className="capitalize">{m}</Label>
                </div>
              ))}
            </div>
          )}

          {/* Hours */}
          {tab === 4 && (
            <div className="space-y-4">
              <div>
                <Label>Non-working days of the week</Label>
                <div className="grid grid-cols-7 gap-2 mt-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                    <button key={day} type="button" onClick={() => {
                      const days = form.nonWorkingDays || [];
                      setForm({
                        ...form,
                        nonWorkingDays: days.includes(i)
                          ? days.filter((d: number) => d !== i)
                          : [...days, i].sort(),
                      });
                    }}
                      className={`py-2 px-3 rounded-lg text-sm border transition-all ${
                        (form.nonWorkingDays || []).includes(i)
                          ? "bg-red-500/10 border-red-500/40 text-red-500"
                          : "bg-background border-border text-foreground hover:border-golden/30"
                      }`}>
                      {day}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Holidays</Label>
                <p className="text-xs text-muted-foreground">Use MM-DD for yearly (12-25) or YYYY-MM-DD for one-time</p>
                <div className="space-y-2">
                  {(form.holidays || []).map((h: string, i: number) => (
                    <div key={i} className="flex gap-2">
                      <Input value={h} onChange={(e) => updateHoliday(i, e.target.value)} placeholder="12-25" />
                      <Button variant="ghost" size="icon" onClick={() => removeHoliday(i)}>
                        <ImBin className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-fit gap-2" onClick={addHoliday}>
                  <ImPlus className="w-3 h-3" /> Add Holiday
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saved ? <><ImCheckmark /> Saved</> : saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}
