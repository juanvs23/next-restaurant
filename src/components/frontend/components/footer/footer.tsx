import lackfooter from "@/public/rectangle-33.jpg";
import FormSuscript from "../FormSuscript/FormSuscript";
import GoToButton from "../goToButton/goToButton";
import LogoBrand from "@/components/common/logo/logoBrand";
import SocialNetwork from "../socialNetwork/SocialNetwork";
import { SponImage } from "@/components/common";

export default function Footer() {
  return (
    <footer
      id="footer"
      className="footer-wrapper"
      style={{ backgroundImage: `url(${lackfooter.src})` }}
    >
      <div className="container">
        <FormSuscript />

        <div className="row footer-middle flex justify-between py-5">
          <div className="element onlyDesktop">
            <h3 className="text-center text-white">Contact Us</h3>
            <ul className="list-none p-0 m-0">
              <li className="mb-4">
                <p className="text-center m-0">9 W 53rd St, New York, NY 10019, USA</p>
              </li>
              <li className="mb-4">
                <p className="text-center m-0">+1 212-344-1230</p>
                <p className="text-center m-0">+1 212-555-1230</p>
              </li>
            </ul>
          </div>
          <div className="element center">
            <h2 className="text-center text-white">
              <LogoBrand />
            </h2>
            <ul className="list-none p-0 m-0">
              <li className="mb-4">
                <p className="text-center m-0">
                  The best way to find yourself is to lose yourself in the
                  service of others.
                </p>
              </li>
              <li className="mb-4">
                <SponImage />
              </li>
              <li className="mb-4">
                <SocialNetwork />
              </li>
            </ul>
          </div>
          <div className="element onlyMobil">
            <h3 className="text-center text-white">Contact Us</h3>
            <ul className="list-none p-0 m-0">
              <li className="mb-4">
                <p className="text-center m-0">9 W 53rd St, New York, NY 10019, USA</p>
              </li>
              <li className="mb-4">
                <p className="text-center m-0">+1 212-344-1230</p>
                <p className="text-center m-0">+1 212-555-1230</p>
              </li>
            </ul>
          </div>
          <div className="element">
            <h3 className="text-center text-white">Working Hours</h3>
            <ul className="list-none p-0 m-0">
              <li className="mb-4">
                <p className="text-center m-0">Monday-Friday:</p>
                <p className="text-center m-0">08:00 am -12:00 am</p>
              </li>
              <li className="mb-4">
                <p className="text-center m-0">Saturday-Sunday:</p>
                <p className="text-center m-0">07:00am -11:00 pm</p>
              </li>
            </ul>
          </div>
        </div>
        <div className="p-2.5 text-center pb-20 lg:pb-10">
          <p className="text-center m-0 text-xs">2021 Gerícht. All Rights reserved.</p>
        </div>
      </div>
      <GoToButton />
    </footer>
  );
}
