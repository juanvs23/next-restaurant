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
  const [availability, setAvailability] = useState<{ available: any[], total: number } | null>(null);
  const [loadingAvail, setLoadingAvail] = useState(false);

  // Fetch availability when date + arrival + departure are set
  useEffect(() => {
    if (!dateTime || !arrivalTime || !departureTime) {
      setAvailability(null);
      return;
    }
    setLoadingAvail(true);
    setAvailability(null);
    fetch(`/api/availability?date=${dateTime}&arrival=${arrivalTime}&departure=${departureTime}`)
      .then((r) => r.json())
      .then((data) => {
        setAvailability({ available: data.available || [], total: data.total || 0 });
        setLoadingAvail(false);
      })
      .catch(() => setLoadingAvail(false));
  }, [dateTime, arrivalTime, departureTime]);

  useEffect(() => {
    dispatch(
      getBookingDate({
        ...bookingDate,
        dateTime,
        turnTime,
        arrivalTime: dateTime ? arrivalTime : "",
        departureTime: dateTime ? departureTime : "",
        completed: dateTime !== "" && arrivalTime !== "" && departureTime !== "",
      }),
    );
  }, [dateTime, turnTime, arrivalTime, departureTime]);

  const [placeholderDate] = useState(() => `${Date.now()}`);
  const tablesAvailable = availability?.available?.length ?? 0;
  const totalTables = availability?.total ?? 0;

  return (
    <div className="space-y-4">
      {/* Date + Turn */}
      <div className="flex flex-col gap-2 md:flex-row">
        <div className="w-full md:w-6/12">
          <Inputs
            getValue={(value: string) => setDateTime(value)}
            name="dateTime"
            title="Reservation date"
            placeHolder={placeholderDate}
            type="date"
          />
        </div>
        <div className="w-full md:w-6/12">
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

          {/* Arrival + Departure — inside same column as turnTime */}
          <div className="flex gap-2 mt-2">
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

          {/* Availability — inside same column */}
          {loadingAvail && (
            <div className="border border-golden/20 rounded-lg p-3 flex items-center gap-2 mt-2">
              <div className="animate-spin w-4 h-4 border-2 border-golden border-t-transparent rounded-full" />
              <span className="text-golden text-sm font-serif">Checking availability...</span>
            </div>
          )}

          {availability && !loadingAvail && (
            <div className={`border rounded-lg p-3 mt-2 text-center ${
              tablesAvailable > 0
                ? "border-golden/40 bg-golden/5"
                : "border-red-500/40 bg-red-500/5"
            }`}>
              {tablesAvailable > 0 ? (
                <p className="text-golden text-sm font-serif">
                  {tablesAvailable} table{tablesAvailable !== 1 ? "s" : ""} available
                </p>
              ) : (
                <p className="text-red-400 text-xs">No tables available for this time range</p>
              )}
            </div>
          )}

          {dateTime && !arrivalTime && !departureTime && !loadingAvail && (
            <div className="border border-golden/20 rounded-lg p-3 mt-2">
              <p className="text-white2 text-xs text-center">Set arrival and departure time</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
