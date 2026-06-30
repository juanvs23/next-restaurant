import { getTranslations } from "next-intl/server";
import { SponImage } from "@/components/common";
import InstagramCaroussel from "@/components/frontend/components/sliders/instagramCarousel/instagramCaroussel";
import { getBaseUrl } from "@/utils/getBaseUrl";

interface MediaItem {
  _id: string;
  url: string;
  alt: string;
  title: string;
  width?: number;
  height?: number;
}

export default async function GalleryPage() {
  const t = await getTranslations("gallery");
  const baseUrl = await getBaseUrl();

  let mediaItems: MediaItem[] = [];
  try {
    const res = await fetch(`${baseUrl}/api/frontend/media?category=gallery&limit=20`, {
      next: { revalidate: 60 },
    });
    if (res.ok) mediaItems = await res.json();
  } catch {}

  const imagesList = mediaItems.length > 0
    ? mediaItems.map((m) => ({
        src: m.url,
        width: m.width || 400,
        height: m.height || 400,
        title: m.title,
      }))
    : [];

  return (
    <main className="bg-black2 min-h-screen pt-24">
      <section className="py-16 px-4">
        <div className="container max-w-5xl text-center">
          <h1 className="text-golden text-5xl md:text-7xl font-serif mb-6">{t("title")}</h1>
          <SponImage justify="center" />
          <p className="text-white2 text-lg max-w-2xl mx-auto mt-6 leading-relaxed">
            {t("description")}
          </p>
        </div>
      </section>

      <section className="py-8 px-4">
        <div className="container max-w-6xl">
          {imagesList.length > 0 ? (
            <InstagramCaroussel images={imagesList} />
          ) : (
            <p className="text-center text-white2/40 py-20">No hay imágenes en la galería aún.</p>
          )}
        </div>
      </section>

      <section className="py-16 px-4 bg-black/30">
        <div className="container max-w-5xl text-center">
          <h2 className="text-golden text-3xl font-serif mb-6">{t("experience")}</h2>
          <p className="text-white2 leading-relaxed max-w-2xl mx-auto">
            {t("experienceText")}
          </p>
        </div>
      </section>
    </main>
  );
}
