import { createSlice } from '@reduxjs/toolkit';
import { StateModal } from "@/types/state";




const initialState: StateModal = {
    openModal: false,
    modal: {
        modalTitle: "",
        modalContent: null,
        ModalFooter: null,
    },
};

export const modalSlicer = createSlice({
    name: "modal",
    initialState,
    reducers: {
        setOpenModal: (state, action) => {
            state.openModal = action.payload;
        },
        setModal: (state, action) => {
            state.modal = action.payload;
        },
    },
});

export const { setOpenModal, setModal } = modalSlicer.actions;

export default modalSlicer.reducer;

