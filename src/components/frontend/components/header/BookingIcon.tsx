"use client";
import { CalendarDays } from "lucide-react";
import { useAppDispatch } from "@/libs/store/hooks";
import { setModal, setOpenModal } from "@/libs/store/slicers/modalSlicer";
import BookingForm from "../booking/bookingForm/bookingForm";

export default function BookingIcon() {
  const dispatch = useAppDispatch();

  return (
    <button
      type="button"
      className="flex items-center justify-center p-1 text-white2 hover:text-golden transition-colors"
      aria-label="Reservar mesa"
      onClick={() => {
        dispatch(
          setModal({
            modalTitle: "Reservar mesa",
            modalContent: <BookingForm />,
            ModalFooter: null,
          })
        );
        dispatch(setOpenModal(true));
      }}
    >
      <CalendarDays className="h-5 w-5" />
    </button>
  );
}
