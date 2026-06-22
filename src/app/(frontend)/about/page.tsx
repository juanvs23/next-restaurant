import { SponImage } from "@/components/common";

export default function AboutPage() {
  return (
    <main className="bg-black2 min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-16 px-4">
        <div className="container max-w-5xl text-center">
          <h1 className="text-golden text-5xl md:text-7xl font-serif mb-6">About Us</h1>
          <SponImage justify="center" />
          <p className="text-white2 text-lg max-w-2xl mx-auto mt-6 leading-relaxed">
            Embark on a culinary journey at GERÍCHT, where exquisite flavors and 
            impeccable service intertwine to create an unforgettable dining experience.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-4">
        <div className="container max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-golden text-4xl font-serif mb-4">Our Story</h2>
              <SponImage justify="start" />
              <p className="text-white2 mt-4 leading-relaxed">
                Founded in 2012, GERÍCHT was born from a shared passion for exceptional cuisine. 
                Our founder and head chef, Kevin Luo, along with a group of devoted friends, 
                transformed a simple dream into a celebrated fine dining destination.
              </p>
              <p className="text-white2 mt-4 leading-relaxed">
                Located in the heart of Chicago, our restaurant combines modern elegance with 
                timeless culinary traditions. Every dish tells a story, every ingredient is 
                carefully selected, and every guest is treated as family.
              </p>
            </div>
            <div className="bg-black/50 border border-golden/20 rounded-lg p-8">
              <h3 className="text-golden text-2xl font-serif mb-4">Our Mission</h3>
              <p className="text-white2 leading-relaxed">
                To create extraordinary dining experiences that linger in memory long after 
                the last bite. We believe in the power of food to bring people together, 
                to celebrate life&apos;s moments, and to explore new horizons of flavor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 bg-black/30">
        <div className="container max-w-5xl">
          <h2 className="text-golden text-4xl font-serif text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Quality", desc: "Only the finest ingredients, prepared with precision and passion." },
              { title: "Hospitality", desc: "Every guest deserves warmth, attention, and a memorable experience." },
              { title: "Tradition", desc: "Honoring culinary heritage while embracing innovation and creativity." },
            ].map((v) => (
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
