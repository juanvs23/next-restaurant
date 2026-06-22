import { useEffect, useState } from "react";
import Inputs from "@/components/frontend/components/formComponents/inputs";
import { useAppDispatch, useAppSelector } from "@/libs/store/hooks";
import { getBookingDate } from "@/libs/store/slicers/bookingSlicer";

export default function DatingInfo() {
  const dispatch = useAppDispatch();
  const { bookingDate } = useAppSelector((state) => state.booking.form!);
  const [dateTime, setDateTime] = useState(bookingDate.dateTime);
  const [turnTime, setTurnTime] = useState(bookingDate.turnTime);
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
        completed: dateTime !== "",
      }),
    );
  }, [dateTime, turnTime]);

  const [placeholderDate] = useState(() => `${Date.now()}`);

  const tablesAvailable = availability["all"] ?? 0;
  const noTables = dateTime && !loadingAvail && tablesAvailable === 0;

  return (
    <>
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
        <div className="w-full form-group md:w-6/12">
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
        </div>
      </div>

      {/* Availability feedback */}
      {dateTime && !loadingAvail && (
        <div className={`text-sm text-center py-1 rounded ${
          noTables
            ? "text-red-500 bg-red-500/10"
            : tablesAvailable > 0
            ? "text-green-500 bg-green-500/10"
            : "text-muted-foreground"
        }`}>
          {loadingAvail ? "Checking availability..." :
           noTables ? "No tables available for this date" :
           `${tablesAvailable} table${tablesAvailable !== 1 ? "s" : ""} available`}
        </div>
      )}
    </>
  );
}
