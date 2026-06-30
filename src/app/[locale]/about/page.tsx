import { SponImage } from "@/components/common";

export default function AboutPage() {
  return (
    <main className="bg-black2 min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-16 px-4">
        <div className="container max-w-5xl text-center">
          <h1 className="text-golden text-5xl md:text-7xl font-serif mb-6">Sobre Nosotros</h1>
          <SponImage justify="center" />
          <p className="text-white2 text-lg max-w-2xl mx-auto mt-6 leading-relaxed">
            Embárcate en un viaje culinario en GERÍCHT, donde sabores exquisitos 
            y un servicio impecable se entrelazan para crear una experiencia 
            gastronómica inolvidable.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-4">
        <div className="container max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-golden text-4xl font-serif mb-4">Nuestra Historia</h2>
              <SponImage justify="start" />
              <p className="text-white2 mt-4 leading-relaxed">
                Fundado en 2012, GERÍCHT nació de una pasión compartida por la 
                cocina excepcional. Nuestro fundador y chef principal, Kevin Luo, 
                junto a un grupo de amigos dedicados, transformó un simple sueño 
                en un reconocido destino de alta cocina.
              </p>
              <p className="text-white2 mt-4 leading-relaxed">
                Ubicado en el corazón de Chicago, nuestro restaurante combina 
                elegancia moderna con tradiciones culinarias atemporales. Cada 
                plato cuenta una historia, cada ingrediente es cuidadosamente 
                seleccionado y cada comensal es tratado como familia.
              </p>
            </div>
            <div className="bg-black/50 border border-golden/20 rounded-lg p-8">
              <h3 className="text-golden text-2xl font-serif mb-4">Nuestra Misión</h3>
              <p className="text-white2 leading-relaxed">
                Crear experiencias gastronómicas extraordinarias que perduren en 
                la memoria mucho después del último bocado. Creemos en el poder 
                de la comida para unir a las personas, celebrar los momentos de 
                la vida y explorar nuevos horizontes de sabor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 bg-black/30">
        <div className="container max-w-5xl">
          <h2 className="text-golden text-4xl font-serif text-center mb-12">Nuestros Valores</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Calidad", desc: "Solo los mejores ingredientes, preparados con precisión y pasión." },
              { title: "Hospitalidad", desc: "Cada comensal merece calidez, atención y una experiencia memorable." },
              { title: "Tradición", desc: "Honrando la herencia culinaria mientras abrazamos la innovación y creatividad." },
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
