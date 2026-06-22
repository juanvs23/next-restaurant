"use client";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

// Non-working days: 0=Sunday (can add more)
const closedDays = [0];

export default function CalendarInput({
  func,
}: {
  func: (value: string) => void;
  min?: number;
  max?: number;
}) {
  const [value, onChange] = useState<Value>(new Date());

  const handleChange = (val: Value) => {
    onChange(val);
    if (val instanceof Date) {
      func(val.toISOString().split("T")[0]);
    }
  };

  const tileDisabled = ({ date }: { date: Date }) => {
    // Disable non-working days
    if (closedDays.includes(date.getDay())) return true;
    // Disable past dates
    if (date < new Date(new Date().toDateString())) return true;
    return false;
  };

  return (
    <Calendar
      onChange={handleChange}
      value={value}
      tileDisabled={tileDisabled}
    />
  );
}
