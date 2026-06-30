"use client";
import { useTranslations } from "next-intl";
import Link from "next/link";
import VideoComponent from "@/components/frontend/components/video/videoComponent";
import bggallery from "@/public/gallery/fondo.webp";
import { SponImage } from "@/components/common";
import InstagramCaroussel from "@/components/frontend/components/sliders/instagramCarousel/instagramCaroussel";

import image1 from "@/public/gallery/rammen-1.webp";
import image2 from "@/public/gallery/whisky-2.webp";
import image3 from "@/public/gallery/egg-3.webp";
import image4 from "@/public/gallery/soup-4.webp";
import image5 from "@/public/gallery/waffle-5.webp";

export default function HomeGallery() {
  const t = useTranslations("gallery");
  const imagesList = [image1, image2, image3, image4, image5];
  return (
    <section id="gallery" className="gallery-home"
      style={{
        backgroundImage: `url(${bggallery.src})`,
        backgroundSize: "cover",
      }}
    >
      <VideoComponent
        videoUrl="/gallery/restaurant.mp4"
        typeVideo="video/mp4"
        showcontrol={false}
        mutedControl={true}
        autoPlayed={false}
        posterUrl="/gallery/restaurant-poster.jpg"
      />
      <div className="gallery-container">
        <div className="call-to-action-gallery">
          <div className="text-content">
            <h3>{t("subtitle")}</h3>
            <SponImage justify="start" />
            <h2>{t("title")}</h2>
            <p>{t("description")}</p>
            <div className="button-container">
              <Link href="/gallery" className="button">
                {t("viewMore")}
              </Link>
            </div>
          </div>
        </div>
        <div className="instagram-gallery">
          <InstagramCaroussel images={imagesList} />
        </div>
      </div>
    </section>
  );
}
