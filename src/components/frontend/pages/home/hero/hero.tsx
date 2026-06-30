import { SponImage } from "@/components/common";
import { Components } from "@/components/frontend";

export default function HeroHome() {
  return (
    <section id="home" className="min-h-screen py-16 flex items-center">
      <div className="container">
        <div className="row max-lg:flex-col-reverse">
          <div className="element-50 pb-16 xl:pb-0 flex">
            <div className="flex flex-col items-center justify-around mr-[10%] max-lg:mr-0">
              <span className="hero-rotate">#Gericht</span>
              <span className="hero-rotate">#Bar</span>
            </div>
            <div>
              <h3 className="text-white tracking-[4px] max-md:text-[1.2rem] max-md:tracking-[2px]">Persigue el nuevo sabor</h3>
              <SponImage justify="start" />
              <h1 className="text-golden text-[5.5rem] leading-[1.2] tracking-[8px] max-md:text-[3rem] max-md:tracking-[2px]">La llave de la Alta Cocina</h1>
              <p>
                Una experiencia gastronómica única donde cada plato cuenta una
                historia. Ingredientes seleccionados, técnicas magistrales y un
                ambiente que despierta todos los sentidos.
              </p>
              <div>
                <a className="button" href="#menu">
                  Explorar Menú
                </a>
              </div>
            </div>
          </div>
          <div className="element-50">
            <Components.slider.HomeSlider />
          </div>
        </div>
      </div>
    </section>
  );
}
