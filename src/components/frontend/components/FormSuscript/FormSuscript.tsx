"use client";
import { CgSpinner } from "react-icons/cg";
import { SponImage } from "@/components/common";
import useSuscript from "./hooks/useSuscript";

export default function FormSuscript() {
  const { handlerSubmit, handlerInput, data, error, loading, emailRef } =
    useSuscript("api/subscription");

  const subcribeText = loading ? (
    <CgSpinner className="animate-spin " />
  ) : (
    "Suscribirse"
  );
  const textError =
    error && error.data.code === "invalid_email" ? (
      <p className="text-red-500">{error.data.message}</p>
    ) : null;
  return (
    <div className="form-wrapper">
      <div className="form-content">
        <h2 className="">Newsletter</h2>
        <SponImage />
        <h3>Suscríbete a nuestro boletín</h3>
        <p className="text-white">¡Y no te pierdas las últimas novedades!</p>
        <form noValidate={true} onSubmit={handlerSubmit}>
          <label htmlFor="newsLetter">
            <input
              type="email"
              name="newsLetter"
              id="newsLetter"
              placeholder="Correo electrónico"
              onChange={handlerInput}
              ref={emailRef}
            />
            {textError}
          </label>
          <button
            type="submit"
            className="button min-h-[60px] flex justify-center items-center text-lg min-w-[200px]"
          >
            {" "}
            {subcribeText}{" "}
          </button>
        </form>
      </div>
    </div>
  );
}
