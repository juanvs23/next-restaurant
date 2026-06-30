"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import logoTop from "@/public/awards/logo-87.svg";
import awardImga from "@/public/awards/mgg-vitchakorn-J5ZivsKiu9c-unsplash 2.jpg";
import G from "@/public/awards/G.svg";
import trophy1 from "@/public/awards/first-throphy.svg";
import trophy2 from "@/public/awards/second-throphy.svg";
import trophy3 from "@/public/awards/third-throphy.svg";
import trophy4 from "@/public/awards/fourth-throphy.svg";

import { SponImage } from "@/components/common";

export default function AwardComponent() {
  const t = useTranslations("awards");

  const trophies = [
    { src: trophy1, key: "trophy1" },
    { src: trophy2, key: "trophy2" },
    { src: trophy3, key: "trophy3" },
    { src: trophy4, key: "trophy4" },
  ];

  return (
    <section id="awards" className="bg-overlay award-wrapper">
      <div className="container container-award">
        <div className="row">
          <div className="element-50">
            <Image src={logoTop.src} height={120} width={120} alt="GERÍCHT restaurant awards logo" />
            <div className="row-award">
              <h5>{t("subtitle")}</h5>
              <SponImage justify="start" />
              <h2>{t("title")}</h2>
              <div className="row-trophy">
                {trophies.map((trophy, i) => (
                  <div key={i} className="trophy">
                    <Image src={trophy.src.src} height={100} width={100} alt={`${t(`${trophy.key}.name`)} award trophy`} />
                    <div className="text">
                      <h5>{t(`${trophy.key}.name`)}</h5>
                      <p>{t(`${trophy.key}.desc`)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="element-50">
            <div className="imageaWard">
              <div className="steak">
                <Image src={awardImga.src} height={awardImga.height} width={awardImga.width} alt="Filete a la parrilla con verduras" />
              </div>
              <div className="gImage">
                <Image src={G.src} height={G.height} width={G.width} alt="GERÍCHT ornamental letter G" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
