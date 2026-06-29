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
    <div className="space-y-4">
      <div className="w-full form-group">
        <Inputs
          getValue={(value: string) => setPersonsNumber(value)}
          name="numberPersons"
          title="Número de personas"
          type="select"
          options={[
            { value: "1", label: "Una persona" },
            { value: "2", label: "Dos personas" },
            { value: "3", label: "Tres personas" },
            { value: "4", label: "Cuatro personas" },
            { value: "5", label: "Cinco personas" },
            { value: "6", label: "Seis personas" },
            { value: "7", label: "Siete personas" },
            { value: "8", label: "Ocho personas" },
            { value: "other", label: "Más personas" },
          ]}
        />
      </div>
      <div className="w-full">
        <Inputs
          getValue={(value: string) => setComments(value)}
          name="comments"
          title="¿Algún comensal con intolerancia o alergia?"
          type="textarea"
        />
      </div>
    </div>
  );
}
