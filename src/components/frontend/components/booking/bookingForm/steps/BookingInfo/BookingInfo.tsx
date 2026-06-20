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
  const [comments, setComments] = React.useState<string>(bookingInfo.comments || "");

  useEffect(() => {
    dispatch(
      getBookingInfo({
        ...bookingInfo,
        numberPersons: personsNumber,
        comments,
        completed: personsNumber !== "",
      }),
    );
  }, [personsNumber, comments]);

  return (
    <div className="booking">
      <div className="flex flex-col gap-2 ">
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
      </div>
      <div className="flex flex-col gap-2">
        <div className="w-full">
          <Inputs
            getValue={(value: string) => setComments(value)}
            name="comments"
            title="Any diners with intolerance/allergy?"
            type="textarea"
          />
        </div>
      </div>
    </div>
  );
}
