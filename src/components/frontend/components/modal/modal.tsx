'use client';
import { motion } from 'framer-motion';
import { LiaTimesSolid } from "react-icons/lia";

import './modal.scss';
import { useAppDispatch, useAppSelector } from '@/libs/store/hooks';
import { RestoState } from '@/types/state';
import { setModal, setOpenModal } from '@/libs/store/slicers/modalSlicer';


const variants = {
    open: { display:"block",opacity: 1, transitionEnd:{ scale:1,} },
    closed: { opacity: 0, scale:0,  transitionEnd: { display: "none" } },
  };
    
export default function Modal() {
    const {openModal, modal} = useAppSelector((state:RestoState) => state.modal);
    const dispatch = useAppDispatch()
    const resetModal =()=>{
        dispatch(setModal({modalTitle:'',modalContent:null,ModalFooter: null}));
        dispatch(setOpenModal(false));
    }
    return(
        <motion.div
            className="modal-wrapper"
            variants={variants}
            transition={{ duration: 0.5 }}

            animate={openModal ? "open" : "closed"} >
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h2>{modal.modalTitle}</h2>
                        <button className="closer" onClick={() => resetModal()}><LiaTimesSolid /></button>
                        </div>
                        <div className="modal-body">
                            {modal.modalContent}
                        </div>
                        <div className="modal-footer">
                            {modal.ModalFooter}
                        </div>
                    </div>
                </div>
        </motion.div>
    )

}