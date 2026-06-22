import { useEffect, useState } from "react";
import Inputs from "@/components/frontend/components/formComponents/inputs";
import { useAppDispatch, useAppSelector } from "@/libs/store/hooks";
import { getBookingDate } from "@/libs/store/slicers/bookingSlicer";

export default function DatingInfo() {
  const dispatch = useAppDispatch();
  const { bookingDate } = useAppSelector((state) => state.booking.form!);
  const [dateTime, setDateTime] = useState(bookingDate.dateTime);
  const [turnTime, setTurnTime] = useState(bookingDate.turnTime);
  const [arrivalTime, setArrivalTime] = useState(bookingDate.arrivalTime || "");
  const [departureTime, setDepartureTime] = useState(bookingDate.departureTime || "");
  const [availability, setAvailability] = useState<Record<string, number>>({});
  const [loadingAvail, setLoadingAvail] = useState(false);

  // Fetch availability when date changes
  useEffect(() => {
    if (!dateTime) return;
    setLoadingAvail(true);
    fetch(`/api/availability?date=${dateTime}`)
      .then((r) => r.json())
      .then((data) => {
        const map: Record<string, number> = {};
        map["all"] = data.available?.length || 0;
        setAvailability(map);
        setLoadingAvail(false);
      })
      .catch(() => setLoadingAvail(false));
  }, [dateTime]);

  useEffect(() => {
    dispatch(
      getBookingDate({
        ...bookingDate,
        dateTime,
        turnTime,
        arrivalTime: dateTime ? arrivalTime : "",
        departureTime: dateTime ? departureTime : "",
        completed: dateTime !== "",
      }),
    );
  }, [dateTime, turnTime, arrivalTime, departureTime]);

  const [placeholderDate] = useState(() => `${Date.now()}`);

  const tablesAvailable = availability["all"] ?? 0;
  const noTables = dateTime && !loadingAvail && tablesAvailable === 0;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-2 md:flex-row">
        <div className="w-full md:w-6/12">
          <Inputs
            getValue={(value: string) => setDateTime(value)}
            name="dateTime"
            title="Reservation date"
            placeHolder={placeholderDate}
            type="date"
          />
          {!dateTime && (
            <div className="border border-golden/20 rounded-lg p-3 mt-2">
              <p className="text-white2 text-xs text-center font-serif">
                Select a date to check availability
              </p>
            </div>
          )}
        </div>
        <div className="w-full md:w-6/12 space-y-2">
          <Inputs
            getValue={(value: string) => setTurnTime(value as any)}
            name="turnTime"
            title="Reservation time"
            type="select"
            options={[
              { value: "morning", label: "Morning" },
              { value: "afternoon", label: "Afternoon" },
              { value: "evening", label: "Evening" },
            ]}
          />

          {/* Availability feedback */}
          {dateTime && (
            <div className={`border rounded-lg p-3 transition-all ${
              loadingAvail
                ? "border-golden/20"
                : noTables
                ? "border-red-500/40 bg-red-500/5"
                : tablesAvailable > 0
                ? "border-golden/40 bg-golden/5"
                : "border-golden/20"
            }`}>
              {loadingAvail ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-3 h-3 border-2 border-golden border-t-transparent rounded-full flex-shrink-0" />
                  <span className="text-golden text-xs">Checking...</span>
                </div>
              ) : noTables ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="text-red-400 text-xs">No tables available</p>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-golden/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-golden" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-golden text-xs">
                    {tablesAvailable} table{tablesAvailable !== 1 ? "s" : ""} available
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Arrival / Departure times */}
          {dateTime && (
            <div className="flex gap-2 pt-1">
              <div className="w-1/2">
                <Inputs
                  getValue={(value: string) => setArrivalTime(value)}
                  name="arrivalTime"
                  title="Arrival"
                  type="time"
                />
              </div>
              <div className="w-1/2">
                <Inputs
                  getValue={(value: string) => setDepartureTime(value)}
                  name="departureTime"
                  title="Departure"
                  type="time"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
