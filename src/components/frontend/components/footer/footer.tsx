import lackfooter from "@/public/rectangle-33.jpg";
import FormSuscript from "../FormSuscript/FormSuscript";
import GoToButton from "../goToButton/goToButton";
import LogoBrand from "@/components/common/logo/logoBrand";
import SocialNetwork from "../socialNetwork/SocialNetwork";
import {SponImage} from "@/components/common";

import "./footer.scss";

export default function Footer() {
  return (
    <footer
      id="footer"
      className="footer-wrapper"
      style={{ backgroundImage: `url(${lackfooter.src})` }}
    >
      <div className="container">
        <FormSuscript />

        <div className="row footer-middle">
          <div className="element onlyDesktop">
            <h3>Contact Us</h3>
            <ul>
              <li>
                <p>9 W 53rd St, New York, NY 10019, USA</p>
              </li>
              <li>
                <p>+1 212-344-1230</p>

                <p>+1 212-555-1230</p>
              </li>
            </ul>
          </div>
          <div className="element center">
            <h2>
              <LogoBrand />
            </h2>
            <ul>
              <li>
                <p>
                  The best way to find yourself is to lose yourself in the
                  service of others.
                </p>
              </li>
              <li>
                <SponImage />
              </li>
              <li>
                <SocialNetwork />
              </li>
            </ul>
          </div>
          <div className="element onlyMobil">
            <h3>Contact Us</h3>
            <ul>
              <li>
                <p>9 W 53rd St, New York, NY 10019, USA</p>
              </li>
              <li>
                <p>+1 212-344-1230</p>

                <p>+1 212-555-1230</p>
              </li>
            </ul>
          </div>
          <div className="element">
            <h3>Working Hours</h3>
            <ul>
              <li>
                <p>Monday-Friday:</p>
                <p>08:00 am -12:00 am</p>
              </li>
              <li>
                <p>Saturday-Sunday:</p>
                <p>07:00am -11:00 pm</p>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>2021 Gerícht. All Rights reserved.</p>
        </div>
      </div>
      <GoToButton />
     
    </footer>
  );
}
