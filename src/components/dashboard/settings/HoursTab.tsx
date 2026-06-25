"use client";
import { ImPlus, ImBin } from "react-icons/im";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useT } from "@/i18n/useT";

interface HoursTabProps {
  form: any;
  setForm: (f: any) => void;
}

export function HoursTab({ form, setForm }: HoursTabProps) {
  const { t } = useT();

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

  return (
    <div className="space-y-4">
      <div>
        <Label>{t("settings.nonWorkingDays")}</Label>
        <div className="grid grid-cols-7 gap-2 mt-2">
          {[t("days.mon"), t("days.tue"), t("days.wed"), t("days.thu"), t("days.fri"), t("days.sat"), t("days.sun")].map((day, i) => (
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
        <Label>{t("settings.holidays")}</Label>
        <p className="text-xs text-muted-foreground">{t("settings.holidaysHint")}</p>
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
          <ImPlus className="w-3 h-3" /> {t("common.add")} {t("settings.holiday")}
        </Button>
      </div>

      <div className="border-t pt-4">
        <div className="grid gap-2 max-w-xs">
          <Label>{t("settings.timezone")}</Label>
          <select value={form.timezone} onChange={(e) => setForm({ ...form, timezone: e.target.value })}
            className="bg-background border border-input rounded px-3 py-2 text-sm w-full h-9">
            <option value="-12:00">UTC-12 (Baker Island)</option>
            <option value="-11:00">UTC-11 (American Samoa)</option>
            <option value="-10:00">UTC-10 (Hawaii)</option>
            <option value="-09:00">UTC-9 (Alaska)</option>
            <option value="-08:00">UTC-8 (Los Angeles, Vancouver)</option>
            <option value="-07:00">UTC-7 (Denver, Phoenix)</option>
            <option value="-06:00">UTC-6 (Chicago, Mexico City)</option>
            <option value="-05:00">UTC-5 (New York, Bogotá)</option>
            <option value="-04:00">UTC-4 (Venezuela, Bolivia, Santiago)</option>
            <option value="-03:00">UTC-3 (Buenos Aires, São Paulo)</option>
            <option value="-02:00">UTC-2 (Fernando de Noronha)</option>
            <option value="-01:00">UTC-1 (Azores)</option>
            <option value="+00:00">UTC±0 (London, Lisbon)</option>
            <option value="+01:00">UTC+1 (Berlin, Paris, Madrid)</option>
            <option value="+02:00">UTC+2 (Athens, Cairo, Kyiv)</option>
            <option value="+03:00">UTC+3 (Moscow, Istanbul)</option>
            <option value="+04:00">UTC+4 (Dubai, Baku)</option>
            <option value="+05:00">UTC+5 (Karachi, Yekaterinburg)</option>
            <option value="+05:30">UTC+5:30 (India, Sri Lanka)</option>
            <option value="+06:00">UTC+6 (Dhaka, Almaty)</option>
            <option value="+07:00">UTC+7 (Bangkok, Jakarta)</option>
            <option value="+08:00">UTC+8 (Beijing, Singapore, Perth)</option>
            <option value="+09:00">UTC+9 (Tokyo, Seoul)</option>
            <option value="+10:00">UTC+10 (Sydney, Guam)</option>
            <option value="+11:00">UTC+11 (Solomon Islands)</option>
            <option value="+12:00">UTC+12 (Auckland, Fiji)</option>
            <option value="+13:00">UTC+13 (Samoa, Tonga)</option>
            <option value="+14:00">UTC+14 (Line Islands)</option>
          </select>
          <p className="text-xs text-muted-foreground">
            {t("settings.timezoneHint")}
          </p>
        </div>
      </div>
    </div>
  );
}
