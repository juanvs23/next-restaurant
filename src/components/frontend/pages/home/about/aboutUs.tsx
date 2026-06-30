"use client";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Gblack from "@/public/aboutus/g-black.svg";
import KnifeImage from "@/public/aboutus/savernake-knives-f4jl2ezowuM-unsplash 2.png";
import { SponImage } from "@/components/common";

export default function AboutUs() {
  const t = useTranslations("about");

  return (
    <section id="aboutus" className="bg-overlay">
      <div
        className="about-container"
        style={{ backgroundImage: `url(${Gblack.src})` }}
      >
        <div className="container">
          <div className="row">
            <div className="element-40 about">
              <h2>{t("heading")}</h2>
              <div className="spoon">
                <SponImage />
              </div>
              <p>{t("subtitle")}</p>
              <div className="about-button">
                <Link href="/about" className="button">
                  {t("knowMore")}
                </Link>
              </div>
            </div>
            <div className="element-20 no-gutter knife">
              <Image
                src={KnifeImage.src}
                alt="cuchillo"
                height={KnifeImage.height}
                width={KnifeImage.width}
                priority
              />
            </div>
            <div className="element-40 history">
              <h2>{t("history")}</h2>
              <div className="spoon">
                <SponImage />
              </div>
              <p>{t("historyText")}</p>
              <div className="history-button">
                <Link href="/about#our-history" className="button">
                  {t("knowMore")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
