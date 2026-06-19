"use client";
import { useAppDispatch, useAppSelector } from "@/libs/store/hooks";
import { setModal, setOpenModal } from "@/libs/store/slicers/modalSlicer";
import BookingForm from "../bookingForm/bookingForm";

export default function BookingButton() {
  const dispath = useAppDispatch();
  const { openModal } = useAppSelector((state) => state.modal);
  const activeButton = openModal
    ? "p-1 transition-all duration-500 border-b-2 border-golden text-white"
    : "p-1 transition-all duration-500 border-b-2 border-transparent text-white hover:border-golden";
  return (
    <button
      className={activeButton}
      onClick={() => {
        dispath(
          setModal({
            modalTitle: "Booking a table",
            modalContent: <BookingForm />,
            ModalFooter: null,
          }),
        );
        dispath(setOpenModal(true));
      }}
    >
      BOOK A TABLE
    </button>
  );
}
