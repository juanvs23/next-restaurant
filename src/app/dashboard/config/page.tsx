"use client";
import { useEffect, useState } from "react";
import { ImCheckmark } from "react-icons/im";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import { useT } from "@/i18n/useT";
import { GeneralTab } from "@/components/dashboard/settings/GeneralTab";
import { TaxTab } from "@/components/dashboard/settings/TaxTab";
import { ChargesTab } from "@/components/dashboard/settings/ChargesTab";
import { PaymentsTab } from "@/components/dashboard/settings/PaymentsTab";
import { HoursTab } from "@/components/dashboard/settings/HoursTab";
import { ShiftsTab } from "@/components/dashboard/settings/ShiftsTab";
import { StorageTab } from "@/components/dashboard/settings/StorageTab";

const tabs = ["general", "tax", "charges", "payments", "hours", "shifts", "storage"];

export default function ConfigPage() {
  const { t, setLocale } = useT();
  const [config, setConfig] = useState<any>(null);
  const [form, setForm] = useState<any>({});
  const [tab, setTab] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/backoffice/config")
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
          nextCreditNoteNumber: d.nextCreditNoteNumber ?? 1,
          timezone: d.timezone || "-04:00",
          storageProvider: d.storageProvider || "local",
          s3Config: {
            accessKeyId: d.s3Config?.accessKeyId || "",
            secretAccessKey: d.s3Config?.secretAccessKey || "",
            region: d.s3Config?.region || "",
            bucket: d.s3Config?.bucket || "",
            endpoint: d.s3Config?.endpoint || "",
          },
        });
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/backoffice/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setSaved(true);
    setLocale(form.defaultLanguage);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!config) return <p className="text-muted-foreground">{t("common.loading")}</p>;

  return (
    <div className="space-y-6">
      <h1 className="dashboard-heading text-3xl font-bold tracking-tight">{t("settings.title")}</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
        {tabs.map((tabKey, i) => (
          <button key={tabKey} onClick={() => setTab(i)}
            className={`px-4 py-1.5 text-sm rounded-md transition-colors ${
              tab === i ? "bg-background text-foreground shadow-sm font-medium" : "text-muted-foreground hover:text-foreground"
            }`}>
            {t("settings." + tabKey)}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>{t("settings." + tabs[tab])}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {tab === 0 && <GeneralTab form={form} setForm={setForm} />}
          {tab === 1 && <TaxTab form={form} setForm={setForm} />}
          {tab === 2 && <ChargesTab />}
          {tab === 3 && <PaymentsTab />}
          {tab === 4 && <HoursTab form={form} setForm={setForm} />}
          {tab === 5 && <ShiftsTab />}
          {tab === 6 && <StorageTab form={form} setForm={setForm} />}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saved ? <><ImCheckmark /> {t("common.saved")}</> : saving ? t("common.saving") : t("settings.saveSettings")}
        </Button>
      </div>
    </div>
  );
}
