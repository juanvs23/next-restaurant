"use client";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const closedDays = [0]; // Sundays

function getMonthDates(year: number, month: number): string[] {
  const dates: string[] = [];
  const lastDay = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= lastDay; d++) {
    const dt = new Date(year, month, d);
    dates.push(dt.toISOString().split("T")[0]);
  }
  return dates;
}

export default function CalendarInput({
  func,
}: {
  func: (value: string) => void;
  min?: number;
  max?: number;
}) {
  const [value, onChange] = useState<Value>(new Date());
  const [viewDate, setViewDate] = useState<Date>(new Date());
  const [unavailableDates, setUnavailableDates] = useState<Set<string>>(new Set());

  // Fetch availability when month changes
  useEffect(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const dates = getMonthDates(year, month);

    // Fetch availability for each date in the month (parallel)
    Promise.all(
      dates.map((d) =>
        fetch(`/api/availability?date=${d}&persons=2`)
          .then((r) => r.json())
          .then((data) => ({ date: d, available: (data.available?.length || 0) > 0 }))
          .catch(() => ({ date: d, available: true })),
      ),
    ).then((results) => {
      const unavailable = results
        .filter((r) => !r.available)
        .map((r) => r.date);
      setUnavailableDates(new Set(unavailable));
    });
  }, [viewDate.getFullYear(), viewDate.getMonth()]);

  const handleChange = (val: Value) => {
    onChange(val);
    if (val instanceof Date) {
      func(val.toISOString().split("T")[0]);
    }
  };

  const tileDisabled = ({ date }: { date: Date }) => {
    if (closedDays.includes(date.getDay())) return true;
    if (date < new Date(new Date().toDateString())) return true;
    const dateStr = date.toISOString().split("T")[0];
    if (unavailableDates.has(dateStr)) return true;
    return false;
  };

  const tileClassName = ({ date }: { date: Date }) => {
    const dateStr = date.toISOString().split("T")[0];
    if (unavailableDates.has(dateStr) && !closedDays.includes(date.getDay())) {
      return "no-tables";
    }
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
