import { getTranslations } from "next-intl/server";
import { SponImage } from "@/components/common";

export default async function AboutPage() {
  const t = await getTranslations("about");

  return (
    <main className="bg-black2 min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-16 px-4">
        <div className="container max-w-5xl text-center">
          <h1 className="text-golden text-5xl md:text-7xl font-serif mb-6">{t("heading")}</h1>
          <SponImage justify="center" />
          <p className="text-white2 text-lg max-w-2xl mx-auto mt-6 leading-relaxed">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-4">
        <div className="container max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-golden text-4xl font-serif mb-4">{t("story")}</h2>
              <SponImage justify="start" />
              <p className="text-white2 mt-4 leading-relaxed">{t("story1")}</p>
              <p className="text-white2 mt-4 leading-relaxed">{t("story2")}</p>
            </div>
            <div className="bg-black/50 border border-golden/20 rounded-lg p-8">
              <h3 className="text-golden text-2xl font-serif mb-4">{t("mission")}</h3>
              <p className="text-white2 leading-relaxed">{t("missionText")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 bg-black/30">
        <div className="container max-w-5xl">
          <h2 className="text-golden text-4xl font-serif text-center mb-12">{t("values")}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {([
              { title: t("quality"), desc: t("qualityDesc") },
              { title: t("hospitality"), desc: t("hospitalityDesc") },
              { title: t("tradition"), desc: t("traditionDesc") },
            ]).map((v) => (
              <div key={v.title} className="border border-golden/20 rounded-lg p-6 text-center">
                <h3 className="text-golden text-xl font-serif mb-3">{v.title}</h3>
                <p className="text-white2 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
