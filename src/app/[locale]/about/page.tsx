import { getTranslations } from "next-intl/server";
import { SponImage } from "@/components/common";
import Image from "next/image";
import ChefImg from "@/public/chef/pexels-ron-lach-8879653 1.jpg";

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

      {/* History */}
      <section className="py-16 px-4">
        <div className="container max-w-5xl">
          <h2 className="text-golden text-4xl font-serif text-center mb-4">{t("historyTitle")}</h2>
          <SponImage justify="center" />
          <div className="mt-10 space-y-12">
            {[
              { year: "2012", key: "history2012" },
              { year: "2015", key: "history2015" },
              { year: "2018", key: "history2018" },
              { year: "2021", key: "history2021" },
              { year: "2024", key: "history2024" },
            ].map((item) => (
              <div key={item.year} className="flex gap-8 items-start">
                <div className="flex-shrink-0 w-20 h-20 rounded-full bg-golden/10 border-2 border-golden flex items-center justify-center">
                  <span className="text-golden font-serif text-xl font-bold">{item.year}</span>
                </div>
                <p className="text-white2 leading-relaxed pt-4">{t(item.key)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chef */}
      <section className="py-16 px-4 bg-black/30">
        <div className="container max-w-5xl">
          <h2 className="text-golden text-4xl font-serif text-center mb-4">{t("chefTitle")}</h2>
          <SponImage justify="center" />
          <div className="mt-10 grid md:grid-cols-2 gap-12 items-center">
            <div className="overflow-hidden rounded-lg border border-golden/20">
              <Image
                src={ChefImg.src}
                alt="Chef Kevin Luo"
                width={ChefImg.width}
                height={ChefImg.height}
                className="w-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-golden text-2xl font-serif mb-2">{t("chefName")}</h3>
              <p className="text-white2/60 text-sm uppercase tracking-wider mb-6">{t("chefRole")}</p>
              <p className="text-white2 leading-relaxed">{t("chefBio")}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
