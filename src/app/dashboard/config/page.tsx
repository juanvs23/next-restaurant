"use client";
import { useEffect, useState } from "react";
import { ImCheckmark } from "react-icons/im";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const tabs = ["General", "Tax", "Charges", "Payments"];

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
