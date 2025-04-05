import LogoBrand from "@/components/common/logo/logoBrand";
import MenuNav from "./MenuNav";
import { montSerrat } from "@/components/common/fonts";
import './scss/header.scss';
import dynamic from 'next/dynamic'
import BookingButton from "../booking/bookingButton/bookingButton";
import Modal from "../modal/modal";


const MobilMenu = dynamic(() => import("./MobilMenu"), {
  ssr: false
});


export default function Header() {
  return (
   <>
    <Modal />
    <header className={`${montSerrat.className} header-wrapper`}>
      <div className="container">
        <div className="rowHeader">
          <div className="logoHeaderSection">
            <LogoBrand />
          </div>
          <MenuNav />
            <MobilMenu />
          <div className="loginHeaderSection">
            <BookingButton />
            
          </div>
        </div>
      </div>
    </header>
   </>
  );
}
