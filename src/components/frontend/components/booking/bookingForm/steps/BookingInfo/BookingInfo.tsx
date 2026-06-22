"use client";
import React, { useEffect } from "react";
import Inputs from "@/components/frontend/components/formComponents/inputs";
import { useAppDispatch, useAppSelector } from "@/libs/store/hooks";
import { getBookingInfo } from "@/libs/store/slicers/bookingSlicer";

export default function BookingInfo() {
  const dispatch = useAppDispatch();
  const { bookingInfo } = useAppSelector((state) => state.booking.form!);
  const [personsNumber, setPersonsNumber] = React.useState<string>(
    bookingInfo.numberPersons || "1",
  );
  const [arrivalTime, setArrivalTime] = React.useState<string>(bookingInfo.arrivalTime || "");
  const [departureTime, setDepartureTime] = React.useState<string>(bookingInfo.departureTime || "");
  const [comments, setComments] = React.useState<string>(bookingInfo.comments || "");

  useEffect(() => {
    dispatch(
      getBookingInfo({
        ...bookingInfo,
        numberPersons: personsNumber,
        arrivalTime,
        departureTime,
        comments,
        completed: personsNumber !== "",
      }),
    );
  }, [personsNumber, arrivalTime, departureTime, comments]);

  return (
    <div className="booking space-y-4">
      <div className="w-full form-group">
        <Inputs
          getValue={(value: string) => setPersonsNumber(value)}
          name="numberPersons"
          title="Person numbers"
          type="select"
          options={[
            { value: "1", label: "One person" },
            { value: "2", label: "Two persons" },
            { value: "3", label: "Three persons" },
            { value: "4", label: "Four persons" },
            { value: "5", label: "Five persons" },
            { value: "6", label: "Six persons" },
            { value: "7", label: "Seven persons" },
            { value: "8", label: "Eight persons" },
            { value: "other", label: "More persons" },
          ]}
        />
      </div>
      <div className="flex gap-4">
        <div className="w-1/2">
          <Inputs
            getValue={(value: string) => setArrivalTime(value)}
            name="arrivalTime"
            title="Arrival time"
            type="time"
          />
        </div>
        <div className="w-1/2">
          <Inputs
            getValue={(value: string) => setDepartureTime(value)}
            name="departureTime"
            title="Departure time"
            type="time"
          />
        </div>
      </div>
      <div className="w-full">
        <Inputs
          getValue={(value: string) => setComments(value)}
          name="comments"
          title="Any diners with intolerance/allergy?"
          type="textarea"
        />
      </div>
    </div>
  );
}
