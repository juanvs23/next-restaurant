import LogoBrand from "@/components/common/logo/logoBrand";
import MenuNav from "./MenuNav";
import { montSerrat } from "@/components/common/fonts";
import BookingButton from "../booking/bookingButton/bookingButton";
import Modal from "../modal/modal";
import MobilMenuWrapper from "./MobilMenuWrapper";
import CartBadge from "@/components/frontend/CartBadge";
import BookingIcon from "./BookingIcon";
import LangSwitcher from "./LangSwitcher";

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
            <div className="flex items-center gap-3">
              <LangSwitcher />
              <CartBadge />
              <div className="lg:hidden">
                <BookingIcon />
              </div>
              <div className="hidden lg:block">
                <BookingButton />
              </div>
              <MobilMenuWrapper />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
