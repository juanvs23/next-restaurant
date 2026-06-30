import { getTranslations } from "next-intl/server";
import { SponImage } from "@/components/common";
import InstagramCaroussel from "@/components/frontend/components/sliders/instagramCarousel/instagramCaroussel";
import image1 from "@/public/gallery/rammen-1.webp";
import image2 from "@/public/gallery/whisky-2.webp";
import image3 from "@/public/gallery/egg-3.webp";
import image4 from "@/public/gallery/soup-4.webp";
import image5 from "@/public/gallery/waffle-5.webp";

export default async function GalleryPage() {
  const t = await getTranslations("gallery");
  const imagesList = [image1, image2, image3, image4, image5];

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
          <InstagramCaroussel images={imagesList} />
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
