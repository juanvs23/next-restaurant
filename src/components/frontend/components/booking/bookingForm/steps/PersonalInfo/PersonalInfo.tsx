"use client";
import React, { useEffect, useState } from "react";
import Inputs from "@/components/frontend/components/formComponents/inputs";
import { useAppDispatch, useAppSelector } from "@/libs/store/hooks";
import { getProfileInfo } from "@/libs/store/slicers/bookingSlicer";
import { emailSchema, phoneNumberSchema } from "@/schemas/profileInfo";

export default function PersonalInfo() {
  const dispath = useAppDispatch();
  const { profileInfo } = useAppSelector((state) => state.booking.form!);
  const { firstName, lastName, email, phoneNumber } = profileInfo;

  const [first, setFirst] = useState(firstName);
  const [last, setLast] = useState(lastName);
  const [mail, setMail] = useState(email);
  const [phone, setPhone] = useState(phoneNumber);

  useEffect(() => {
    if (first != "" && last != "" && mail != "" && phone != "") {
      if (!emailSchema.safeParse(mail).success) {
        return;
      }

      if (!phoneNumberSchema.safeParse(phone).success) {
        return;
      }
      dispath(
        getProfileInfo({
          step: 0,
          firstName: first,
          lastName: last,
          email: mail,
          phoneNumber: phone,
          completed: true,
        }),
      );
    } else {
      dispath(
        getProfileInfo({
          ...profileInfo,
          completed: false,
        }),
      );
    }
  }, [first, last, mail, phone]);

  return (
    <div className="personal-info">
      <div className="flex flex-col gap-2 md:flex-row">
        <div className="w-full md:w-6/12">
          <Inputs
            getValue={(value: string) => setFirst(value)}
            name="firstName"
            title="first name"
            placeHolder="Ex: John"
            value={first}
            type="text"
          />
        </div>
        <div className="w-full md:w-6/12">
          <Inputs
            getValue={(value: string) => setLast(value)}
            name="lastName"
            title="Last name"
            value={last}
            placeHolder="Ex: Doe"
            type="text"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2 md:flex-row">
        <div className="w-full form-group md:w-6/12">
          <Inputs
            getValue={(value: string) => setMail(value)}
            name="email"
            title="Email"
            value={mail}
            placeHolder="Ex: johndoe@example.com"
            type="text"
          />
        </div>
        <div className="w-full md:w-6/12">
          <Inputs
            getValue={(value: string) => setPhone(value)}
            name="phoneNumber"
            title="Phone number"
            value={phone}
            placeHolder="Ex: +1 123 456 789"
            type="text"
          />
        </div>
      </div>
    </div>
  );
}
