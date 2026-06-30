"use client";
import { useTranslations } from "next-intl";
import Link from "next/link";
import ImageContainer from "@/components/frontend/components/imageContainer/imageContainer";
import Image from "next/image";
import { SponImage } from "@/components/common";
import Chef from "@/public/chef/pexels-ron-lach-8879653 1.jpg";
import Quote from "@/public/quote.svg";
import Firm from "@/public/chef/Kevin Luo.png";

export default function OurChef() {
  const t = useTranslations("chef");

  return (
    <section id="chef" className="bg-overlay">
      <div className="container">
        <div className="row">
          <div className="element-50">
            <ImageContainer
              url={Chef.src}
              altTitle={"Chef Kevin Luo"}
              heightProps={Chef.height}
              widthProps={Chef.width}
            />
          </div>
          <div className="element-50">
            <p className="subtitle">{t("word")}</p>
            <SponImage justify="start" />
            <h2 className="title">{t("belief")}</h2>
            <p className="text-Chef">
              <Image
                src={Quote.src}
                height={Quote.height}
                width={Quote.width}
                alt={"Quote"}
              />
              {t("quote")}
            </p>
            <h3>{t("name")}</h3>
            <h5>{t("role")}</h5>
            <div className="firmImage">
              <Image
                src={Firm.src}
                height={Firm.height}
                width={Firm.width}
                alt={"Kevin Luo"}
              />
            </div>
            <div className="mt-6">
              <Link href="/chef" className="button">
                {t("meetChef")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
