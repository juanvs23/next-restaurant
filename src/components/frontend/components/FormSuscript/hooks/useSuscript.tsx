import { SyntheticEvent, useState,useRef } from "react";
import { createInstance } from "@/libs";
import { suscriptionSchema } from "@/schemas/suscription";
import { SuscriptionResponse } from "@/types/suscription";
import { useAppDispatch } from "@/libs/store/hooks";
import { setModal, setOpenModal } from "@/libs/store/slicers/modalSlicer";

export default function useSuscript(url:string) {
    const dispatch = useAppDispatch();
    const [data, setData] = useState<SuscriptionResponse|null>(null)
    const [error, setError] = useState<SuscriptionResponse|null>(null)
    const [loading, setLoading] = useState(false)
    const emailRef = useRef<HTMLInputElement|null>(null)

    const handlerClose=()=>{
        dispatch(setOpenModal(false))
        dispatch(setModal({modalTitle:'',modalContent:null,ModalFooter: null}))
    }

    const handlerSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
        setLoading(true);
        e.preventDefault();
        const email = e.currentTarget.newsLetter.value;
        const checkEmail = suscriptionSchema.safeParse({email})
        if(!checkEmail.success){
            setError({status:'error',data:{message: "Please enter a valid email.",code:"invalid_email"}})
            setLoading(false);
            return;
        }
       const response = await createInstance.post(url, { email })
        if(response.status === 200){
            setData(response.data);
            dispatch(setModal( { modalTitle: "Thank you", modalContent: <div className="min-h-30 flex justify-center flex-col items-center min-w-60 gap-2" dangerouslySetInnerHTML={{ __html: response.data.data.message||'' }}></div>, ModalFooter: <div className="min-h-10 min-w-60 flex justify-center"><button className="button" onClick={handlerClose}>close</button></div> }))
            dispatch(setOpenModal(true))
           emailRef.current!.value = '' 
        }

        if(response.status === 400){
            setError(response.data)
        }

        setLoading(false)
    }

    const handlerInput = (e: SyntheticEvent<HTMLInputElement>) => {
        setError(null)
    }

    return { handlerInput,handlerSubmit, data, error, loading,emailRef }
}