import { SyntheticEvent, useState, useRef } from "react";
import { createInstance } from "@/libs";
import { subscriptionSchema } from "@/schemas/subscription";
import { SubscriptionResponse } from "@/types/subscription";
import { useAppDispatch } from "@/libs/store/hooks";
import { setModal, setOpenModal } from "@/libs/store/slicers/modalSlicer";

export default function useSuscript(url: string) {
  const dispatch = useAppDispatch();
  const [data, setData] = useState<SubscriptionResponse | null>(null);
  const [error, setError] = useState<SubscriptionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const emailRef = useRef<HTMLInputElement | null>(null);

  const handlerClose = () => {
    dispatch(setOpenModal(false));
    dispatch(
      setModal({ modalTitle: "", modalContent: null, ModalFooter: null }),
    );
  };

  const handlerSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    const email = e.currentTarget.newsLetter.value;
    const checkEmail = subscriptionSchema.safeParse({ email });
    if (!checkEmail.success) {
      setError({
        status: "error",
        data: { message: "Ingresa un correo electrónico válido.", code: "invalid_email" },
      });
      setLoading(false);
      return;
    }
    const response = await createInstance.post(url, { email });
    if (response.status === 200) {
      setData(response.data);
      dispatch(
        setModal({
          modalTitle: "¡Gracias!",
          modalContent: (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="w-16 h-16 rounded-full bg-golden/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-golden" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-golden text-xl font-serif">¡Suscripción exitosa!</h3>
              <p className="text-white2">Gracias por suscribirte a nuestro boletín. Serás el primero en conocer nuestras últimas novedades y ofertas exclusivas.</p>
            </div>
          ),
          ModalFooter: (
            <div className="flex justify-center pt-2">
              <button className="button" onClick={handlerClose}>
                Cerrar
              </button>
            </div>
          ),
        }),
      );
      dispatch(setOpenModal(true));
      emailRef.current!.value = "";
    }

    if (response.status === 400) {
      setError(response.data);
    }

    setLoading(false);
  };

  const handlerInput = (e: SyntheticEvent<HTMLInputElement>) => {
    setError(null);
  };

  return { handlerInput, handlerSubmit, data, error, loading, emailRef };
}
