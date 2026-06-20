"use client";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

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

  return <Calendar onChange={handleChange} value={value} />;
}
