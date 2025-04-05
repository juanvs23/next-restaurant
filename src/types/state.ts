export interface StateModal{
    openModal:boolean
    modal:{
        modalTitle:string
        modalContent:React.ReactNode| React.ReactElement | null
        ModalFooter: React.ReactNode| React.ReactElement | null
    }
   
}
export interface RestoState{
    modal:StateModal
}
export interface ModalAction{
    setOpenModal : ( arg0: StateModal["openModal"] ) => void
    setModal: ( arg0: StateModal["modal"] ) => void
}