"use client";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

function getMonthDates(year: number, month: number): string[] {
  const dates: string[] = [];
  const lastDay = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= lastDay; d++) {
    dates.push(new Date(year, month, d).toISOString().split("T")[0]);
  }
  return dates;
}

export default function CalendarInput({ func }: { func: (value: string) => void }) {
  const [value, onChange] = useState<Value>(new Date());
  const [viewDate, setViewDate] = useState<Date>(new Date());
  const [unavailableDates, setUnavailableDates] = useState<Set<string>>(new Set());
  const [closedDays, setClosedDays] = useState<number[]>([0]);
  const [holidays, setHolidays] = useState<string[]>([]);

  // Load config for non-working days and holidays
  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then((cfg) => {
        if (cfg.nonWorkingDays) setClosedDays(cfg.nonWorkingDays);
        if (cfg.holidays) setHolidays(cfg.holidays);
      })
      .catch(() => {});
  }, []);

  // Fetch availability when month changes
  useEffect(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const dates = getMonthDates(year, month);

    Promise.all(
      dates.map((d) =>
        fetch(`/api/availability?date=${d}&persons=2`)
          .then((r) => r.json())
          .then((data) => ({ date: d, available: (data.available?.length || 0) > 0 }))
          .catch(() => ({ date: d, available: true })),
      ),
    ).then((results) => {
      const unavailable = results.filter((r) => !r.available).map((r) => r.date);
      setUnavailableDates(new Set(unavailable));
    });
  }, [viewDate.getFullYear(), viewDate.getMonth()]);

  const handleChange = (val: Value) => {
    onChange(val);
    if (val instanceof Date) func(val.toISOString().split("T")[0]);
  };

  const tileDisabled = ({ date }: { date: Date }) => {
    const dateStr = date.toISOString().split("T")[0]; // "2026-06-22"
    const mmdd = dateStr.slice(5); // "06-22"
    const isHoliday = holidays.includes(dateStr) || holidays.includes(mmdd);
    if (closedDays.includes(date.getDay())) return true;
    if (date < new Date(new Date().toDateString())) return true;
    if (unavailableDates.has(dateStr)) return true;
    return false;
  };

  const tileClassName = ({ date }: { date: Date }) => {
    const dateStr = date.toISOString().split("T")[0];
    const mmdd = dateStr.slice(5);
    const isHoliday = holidays.includes(dateStr) || holidays.includes(mmdd);
    const today = new Date(new Date().toDateString());
    const isPast = date < today;
    const isSunday = closedDays.includes(date.getDay());

    if (isPast) return "past";
    if (isSunday || isHoliday) return "sunday";
    if (unavailableDates.has(dateStr)) return "no-tables";
    return null;
  };

  return (
    <Calendar
      onChange={handleChange}
      value={value}
      tileDisabled={tileDisabled}
      tileClassName={tileClassName}
      onActiveStartDateChange={({ activeStartDate }) => {
        if (activeStartDate) setViewDate(activeStartDate);
      }}
    />
  );
}
