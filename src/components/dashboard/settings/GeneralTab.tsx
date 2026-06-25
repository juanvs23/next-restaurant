"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useT } from "@/i18n/useT";

interface GeneralTabProps {
  form: any;
  setForm: (f: any) => void;
}

export function GeneralTab({ form, setForm }: GeneralTabProps) {
  const { t } = useT();

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2 grid gap-1">
        <Label>{t("settings.businessName")}</Label>
        <Input value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} />
      </div>
      <div className="grid gap-1">
        <Label>{t("settings.rif")}</Label>
        <Input value={form.rif} onChange={(e) => setForm({ ...form, rif: e.target.value })} placeholder="J-12345678-9" />
      </div>
      <div className="grid gap-1">
        <Label>{t("settings.phone")}</Label>
        <Input value={form.businessPhone} onChange={(e) => setForm({ ...form, businessPhone: e.target.value })} />
      </div>
      <div className="col-span-2 grid gap-1">
        <Label>{t("settings.address")}</Label>
        <Input value={form.businessAddress} onChange={(e) => setForm({ ...form, businessAddress: e.target.value })} />
      </div>
      <div className="col-span-2 grid gap-1">
        <Label>{t("settings.email")}</Label>
        <Input value={form.businessEmail} onChange={(e) => setForm({ ...form, businessEmail: e.target.value })} />
      </div>
      <div className="grid gap-1">
        <Label>{t("settings.defaultLanguage")}</Label>
        <select value={form.defaultLanguage} onChange={(e) => setForm({ ...form, defaultLanguage: e.target.value })}
          className="bg-background border border-input rounded px-3 py-2 text-sm">
          <option value="es">Español</option>
          <option value="en">English</option>
          <option value="pt">Português</option>
        </select>
      </div>
    </div>
  );
}
