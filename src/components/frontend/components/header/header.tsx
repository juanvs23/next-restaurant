import LogoBrand from "@/components/common/logo/logoBrand";
import MenuNav from "./MenuNav";
import { montSerrat } from "@/components/common/fonts";
import BookingButton from "../booking/bookingButton/bookingButton";
import Modal from "../modal/modal";
import MobilMenuWrapper from "./MobilMenuWrapper";
import CartBadge from "@/components/frontend/CartBadge";

export default function Header() {
  return (
    <>
      <Modal />
      <header className={`${montSerrat.className} flex fixed w-full left-0 top-0 z-[9999] bg-black2`}>
        <div className="container">
          <div className="flex max-w-[1330px] w-full items-center justify-between px-[15px] py-2.5">
            <div className="lg:w-1/4">
              <LogoBrand />
            </div>
            <MenuNav />
            <MobilMenuWrapper />
            <div className="hidden lg:flex justify-end lg:w-1/4 items-center gap-4">
              <CartBadge />
              <BookingButton />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
