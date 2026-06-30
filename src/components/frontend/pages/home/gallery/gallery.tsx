"use client";
import { useTranslations } from "next-intl";
import Link from "next/link";
import VideoComponent from "@/components/frontend/components/video/videoComponent";
import bggallery from "@/public/gallery/fondo.webp";
import { SponImage } from "@/components/common";
import InstagramCaroussel from "@/components/frontend/components/sliders/instagramCarousel/instagramCaroussel";
import { useMedia } from "@/components/frontend";

interface GalleryImage {
  src: string;
  width?: number;
  height?: number;
  title?: string;
}

interface Props {
  initialImages?: GalleryImage[];
}

export default function HomeGallery({ initialImages }: Props = {}) {
  const t = useTranslations("gallery");
  const { images: mediaImages } = useMedia({
    categories: ["gallery", "home"],
    limit: 8,
  });

  const source = initialImages?.length ? initialImages : [];
  const clientImages = mediaImages.map((m) => ({
    src: m.url,
    width: m.width || 400,
    height: m.height || 400,
    title: m.title,
  }));

  const images = initialImages?.length ? source : clientImages;

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
          {images.length > 0 && <InstagramCaroussel images={images} />}
        </div>
      </div>
    </section>
  );
}
