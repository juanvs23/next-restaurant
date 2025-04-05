"use client";
import React from "react";
import Inputs from "@/components/frontend/components/formComponents/inputs";

export default function BookingInfo() {
  const [personsNumber, setPersonsNumber] = React.useState<string>("1");

  console.log(personsNumber);

  const persons = Number.isNaN(parseInt(personsNumber)) ? true : false;

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
      {false && (
        <div className="flex flex-col gap-2 md:flex-row">
          <div className="w-full md:w-6/12">
            <Inputs
              getValue={(value: string) => console.log(value)}
              name="togglePerson"
              title="Do you want special reservation"
              type="toggle"
            />
          </div>
          <div className="w-full form-group md:w-6/12">
            <Inputs
              getValue={(value: string) => console.log(value)}
              name="totalPersons"
              title="Total persons"
              type="text"
            />
          </div>
        </div>
      )}
      <div className="flex flex-col gap-2">
        <div className="w-full">
          <Inputs
            getValue={(value: string) => console.log(value)}
            name="comments"
            title="Any diners with intolerance/allergy?"
            type="textarea"
          />
        </div>
      </div>
    </div>
  );
}
