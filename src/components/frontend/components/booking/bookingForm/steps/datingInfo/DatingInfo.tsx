"use client";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useAppDispatch, useAppSelector } from "@/libs/store/hooks";
import { getBookingDate } from "@/libs/store/slicers/bookingSlicer";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface Slot {
  time: string;
  available: number;
}

interface TurnSlots {
  turnId: string;
  name: string;
  label: string;
  color: string;
  startTime: string;
  endTime: string;
  slots: Slot[];
}

export default function DatingInfo() {
  const dispatch = useAppDispatch();
  const { bookingDate } = useAppSelector((state) => state.booking.form!);

  const [selectedDate, setSelectedDate] = useState<Value>(
    bookingDate.dateTime ? new Date(bookingDate.dateTime) : null
  );
  const [turnSlots, setTurnSlots] = useState<TurnSlots[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    turn: string;
    arrival: string;
    departure: string;
  } | null>(null);

  const dateStr = selectedDate instanceof Date
    ? selectedDate.toISOString().split("T")[0]
    : "";

  // Fetch slots when date changes
  useEffect(() => {
    if (!dateStr) {
      setTurnSlots([]);
      setSelectedSlot(null);
      return;
    }
    setLoading(true);
    setSelectedSlot(null);
    fetch(`/api/availability/slots?date=${dateStr}`)
      .then((r) => r.json())
      .then((data) => {
        setTurnSlots(data.turns || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [dateStr]);

  // Dispatch to Redux when slot is selected
  useEffect(() => {
    if (!dateStr || !selectedSlot) {
      dispatch(
        getBookingDate({
          ...bookingDate,
          dateTime: dateStr,
          arrivalTime: "",
          departureTime: "",
          completed: false,
        }),
      );
      return;
    }
    dispatch(
      getBookingDate({
        ...bookingDate,
        dateTime: dateStr,
        turnTime: selectedSlot.turn,
        arrivalTime: selectedSlot.arrival,
        departureTime: selectedSlot.departure,
        completed: true,
      }),
    );
  }, [dateStr, selectedSlot]);

  const hasSlots = turnSlots.some((t) => t.slots.some((s) => s.available > 0));
  const totalAvailable = turnSlots.reduce(
    (sum, t) => sum + t.slots.reduce((s, sl) => s + sl.available, 0),
    0,
  );

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Calendar */}
      <div className="md:w-1/2">
        <p className="text-golden font-serif text-sm mb-2">Select a date</p>
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          minDate={new Date()}
          className="!border !border-golden/20 !rounded-lg !bg-transparent"
        />
      </div>

      {/* Slots */}
      <div className="md:w-1/2">
        {!selectedDate && (
          <div className="border border-golden/20 rounded-lg p-8 text-center">
            <p className="text-white2 text-sm font-serif">
              Select a date to see available times
            </p>
          </div>
        )}

        {selectedDate && loading && (
          <div className="border border-golden/20 rounded-lg p-8 text-center">
            <div className="animate-spin w-6 h-6 border-2 border-golden border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-white2 text-sm font-serif">Checking availability...</p>
          </div>
        )}

        {selectedDate && !loading && !hasSlots && (
          <div className="border border-red-500/40 bg-red-500/5 rounded-lg p-8 text-center">
            <p className="text-red-400 font-serif text-sm">No tables available for this date</p>
            <p className="text-white2 text-xs mt-2">Please select another date</p>
          </div>
        )}

        {selectedDate && !loading && hasSlots && (
          <div className="space-y-4">
            <p className="text-golden font-serif text-sm">
              {totalAvailable} table{totalAvailable !== 1 ? "s" : ""} available
            </p>

            {turnSlots.map((turn) => {
              const availableSlots = turn.slots.filter((s) => s.available > 0);
              if (availableSlots.length === 0) return null;

              return (
                <div key={turn.turnId}>
                  <p
                    className="text-xs font-serif font-semibold mb-2"
                    style={{ color: turn.color }}
                  >
                    {turn.label} ({turn.startTime}–{turn.endTime})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {availableSlots.map((slot) => {
                      const isSelected =
                        selectedSlot?.turn === turn.name &&
                        selectedSlot?.arrival === slot.time;

                      return (
                        <button
                          key={slot.time}
                          type="button"
                          onClick={() =>
                            setSelectedSlot({
                              turn: turn.name,
                              arrival: slot.time,
                              departure: `${parseInt(slot.time) + 1}:00`,
                            })
                          }
                          className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                            isSelected
                              ? "bg-golden text-black border-golden font-medium"
                              : "bg-transparent text-golden border-golden/40 hover:bg-golden/10"
                          }`}
                        >
                          {slot.time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
