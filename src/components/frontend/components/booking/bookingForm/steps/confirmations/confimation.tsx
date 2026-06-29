"use client";
import { useAppSelector } from "@/libs/store/hooks";

export default function Confirmation() {
  const { form } = useAppSelector((state) => state.booking);
  if (!form) return null;

  const { profileInfo, bookingDate, bookingInfo } = form;

  return (
    <div className="text-white space-y-4">
      <h2 className="text-golden text-2xl text-center">Confirma tu reserva</h2>

      <div className="bg-black/50 border border-golden/20 rounded-lg p-4 space-y-3">
        <div>
          <h3 className="text-golden text-sm uppercase tracking-wide">Datos personales</h3>
          <p>{profileInfo.firstName} {profileInfo.lastName}</p>
          <p className="text-white2">{profileInfo.email}</p>
          <p className="text-white2">{profileInfo.phoneNumber}</p>
        </div>

        <div className="border-t border-golden/20 pt-3">
          <h3 className="text-golden text-sm uppercase tracking-wide">Fecha y hora</h3>
          <p>{bookingDate.dateTime || "No seleccionado"}</p>
          <p className="text-white2 capitalize">{bookingDate.turnTime}</p>
        </div>

        <div className="border-t border-golden/20 pt-3">
          <h3 className="text-golden text-sm uppercase tracking-wide">Detalles</h3>
          <p>{bookingInfo.numberPersons} comensales</p>
          {bookingInfo.comments && (
            <p className="text-white2 italic">&ldquo;{bookingInfo.comments}&rdquo;</p>
          )}
        </div>
      </div>
    </div>
  );
}
