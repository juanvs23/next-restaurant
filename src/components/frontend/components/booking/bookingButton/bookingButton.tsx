'use client';
import { useAppDispatch, useAppSelector } from "@/libs/store/hooks";
import { setModal, setOpenModal } from "@/libs/store/slicers/modalSlicer";
import BookingForm from "../bookingForm/bookingForm";
import './bookingButton.scss'

export default function BookingButton() {
    const dispath = useAppDispatch();
    const { openModal } = useAppSelector( state => state.modal );
    const activeButton = openModal ? 'buuton-link active':'buuton-link';
    return (
        <button className={`bookingButton ${activeButton}`} onClick={() => { 
            dispath(setModal({modalTitle:'Booking a table',modalContent:<BookingForm/>,ModalFooter:null}))
            dispath(setOpenModal(true));
        }}>
            BOOK A TABLE
        </button>
    )
}