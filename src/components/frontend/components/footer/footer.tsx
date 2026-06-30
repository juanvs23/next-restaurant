"use client";
import { useTranslations } from "next-intl";
import lackfooter from "@/public/rectangle-33.jpg";
import FormSuscript from "../FormSuscript/FormSuscript";
import GoToButton from "../goToButton/goToButton";
import LogoBrand from "@/components/common/logo/logoBrand";
import SocialNetwork from "../socialNetwork/SocialNetwork";
import { SponImage } from "@/components/common";

export default function Footer() {
  const t = useTranslations("footer");

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
            <h3 className="text-center text-white">{t("contact")}</h3>
            <ul className="list-none p-0 m-0">
              <li className="mb-4">
                <p className="text-center m-0">{t("address")}</p>
              </li>
              <li className="mb-4">
                <p className="text-center m-0">{t("phone1")}</p>
                <p className="text-center m-0">{t("phone2")}</p>
              </li>
            </ul>
          </div>
          <div className="element center">
            <h2 className="text-center text-white">
              <LogoBrand />
            </h2>
            <ul className="list-none p-0 m-0">
              <li className="mb-4">
                <p className="text-center m-0">{t("motto")}</p>
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
            <h3 className="text-center text-white">{t("contact")}</h3>
            <ul className="list-none p-0 m-0">
              <li className="mb-4">
                <p className="text-center m-0">{t("address")}</p>
              </li>
              <li className="mb-4">
                <p className="text-center m-0">{t("phone1")}</p>
                <p className="text-center m-0">{t("phone2")}</p>
              </li>
            </ul>
          </div>
          <div className="element">
            <h3 className="text-center text-white">{t("hours")}</h3>
            <ul className="list-none p-0 m-0">
              <li className="mb-4">
                <p className="text-center m-0">{t("weekdays")}</p>
                <p className="text-center m-0">{t("weekdaysHours")}</p>
              </li>
              <li className="mb-4">
                <p className="text-center m-0">{t("weekends")}</p>
                <p className="text-center m-0">{t("weekendsHours")}</p>
              </li>
            </ul>
          </div>
        </div>
        <div className="p-2.5 text-center pb-20 lg:pb-10">
          <p className="text-center m-0 text-xs">{t("copyright")}</p>
        </div>
      </div>
      <GoToButton />
    </footer>
  );
}
