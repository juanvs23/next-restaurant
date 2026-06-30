"use client";
import { useTranslations } from "next-intl";
import vitor from "@/public/find/vitor-pinto-bYSpfD0Wn04-unsplash 1.jpg";
import ImageContainer from "@/components/frontend/components/imageContainer/imageContainer";
import { SponImage } from "@/components/common";

function FindUs() {
  const t = useTranslations("contact");

  return (
    <section id="find" className="flex items-center justify-center relative py-24">
      <div className="container z-[2]">
        <div className="row">
          <div className="element-50">
            <div className="info-content">
              <h3 className="text-golden">{t("subtitle")}</h3>
              <SponImage justify="start" />
              <h2 className="text-golden">{t("title")}</h2>
              <p className="direction mb-10">{t("address")}</p>
              <div className="working-hours mb-12">
                <h3 className="title text-golden">{t("hours")}</h3>
                <p className="opening">{t("weekdays")}</p>
                <p className="closing">{t("weekends")}</p>
              </div>
              <a href="#footer" className="button">
                {t("visitUs")}
              </a>
            </div>
          </div>
          <div className="element-50">
            <ImageContainer
              url={vitor.src}
              altTitle="products"
              widthProps={vitor.width}
              heightProps={vitor.height}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default FindUs;
