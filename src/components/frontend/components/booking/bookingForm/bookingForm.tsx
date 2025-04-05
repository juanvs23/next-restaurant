"use client";
import React, { use, useEffect, useState } from "react";
import { useAppSelector } from "@/libs/store/hooks";
import PersonalInfo from "./steps/PersonalInfo/PersonalInfo";
import BookingInfo from "./steps/BookingInfo/BookingInfo";
import DatingInfo from "./steps/datingInfo/DatingInfo";
import Confirmation from "./steps/confirmations/confimation";
import ResponseInfo from "./steps/responseInfo/responseInfo";

export default function BookingForm() {
  const [activeIndex, setActiveIndex] = useState(0);
  const useBooking = useAppSelector((state) => state.booking);
  const steps = [
    {
      stepIndex: 0,
      title: "Personal Info",
      content: <PersonalInfo />,
    },
    {
      stepIndex: 1,
      title: "Booking Info",
      content: <BookingInfo />,
    },
    {
      stepIndex: 2,
      title: "Dating",
      content: <DatingInfo />,
    },
    {
      stepIndex: 3,
      title: "Confirmation",
      content: <Confirmation />,
    },
    {
      stepIndex: 4,
      title: "Thank you!",
      content: <ResponseInfo />,
    },
  ];
  return (
    <div className="booking">
      <h2 className="text-lg text-center">{steps[activeIndex].title}</h2>
      <div className="booking-form">
        <div className="steps">
          {steps.map((step) => {
            if (step.stepIndex === activeIndex) {
              return <div key={step.stepIndex}> {step.content} </div>;
            }
          })}
        </div>
        <div className="mt-4 flex flex-col justify-center items-center gap-2">
          <div className="w-full flex gap-3 form-group flex-col md:flex-row ">
            {steps.map((step) => {
              if (step.stepIndex < Object.keys(useBooking.form!).length) {
                const [completed, setCompleted] = useState(false);

                useEffect(() => {
                  setCompleted(
                    Object.entries(useBooking.form!)[step.stepIndex][1]
                      .completed,
                  );
                  //  console.log(Object.entries(useBooking.form!)[step.stepIndex]);
                }, [
                  Object.entries(useBooking.form!)[step.stepIndex][1].completed,
                ]);
                return (
                  <button
                    key={step.stepIndex}
                    className={`w-full button-inverse${completed ? " completed" : ""}`}
                    type="button"
                    onClick={() => setActiveIndex(step.stepIndex)}
                  >
                    {step.title}
                  </button>
                );
              }
              if (step.stepIndex < Object.keys(useBooking.form!).length + 1) {
                return (
                  <button
                    key={step.stepIndex}
                    className={`w-full button-inverse${
                      useBooking.form?.bookingDate.completed === true &&
                      useBooking.form?.bookingInfo.completed === true &&
                      useBooking.form?.profileInfo.completed === true
                        ? " completed"
                        : ""
                    }`}
                    type="button"
                    onClick={() => setActiveIndex(step.stepIndex)}
                  >
                    {step.title}
                  </button>
                );
              }
            })}
          </div>
          <div className="w-full my-6 flex justify-between gap-4  items-center">
            <div className="w-6/12 flex justify-start">
              {activeIndex > 0 && (
                <button
                  className="w-fit  button"
                  type="button"
                  onClick={() => setActiveIndex(activeIndex - 1)}
                >
                  Back
                </button>
              )}
            </div>
            <div className="w-6/12 flex justify-end">
              {activeIndex < steps.length - 2 && (
                <button
                  className="w-fit button"
                  type="button"
                  onClick={() => setActiveIndex(activeIndex + 1)}
                >
                  Next
                </button>
              )}
              {useBooking.form?.bookingDate.completed === false &&
                useBooking.form?.bookingInfo.completed === false &&
                useBooking.form?.profileInfo.completed === false &&
                activeIndex === 3 && (
                  <button className="w-fit button" type="submit">
                    Submit
                  </button>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
