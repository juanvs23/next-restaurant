import Link from "next/link";
import Image from "next/image";
import Gblack from "@/public/aboutus/g-black.svg";
import KnifeImage from "@/public/aboutus/savernake-knives-f4jl2ezowuM-unsplash 2.png";
import { SponImage } from "@/components/common";

export default function AboutUs() {
  return (
    <section id="aboutus" className="bg-overlay">
      <div
        className="about-container"
        style={{ backgroundImage: `url(${Gblack.src})` }}
      >
        <div className="container">
          <div className="row">
            <div className="element-40 about">
              <h2>Sobre Nosotros</h2>
              <div className="spoon">
                <SponImage />
              </div>
              <p>
                Embárcate en un viaje culinario en GERÍCHT, donde sabores
                exquisitos y un servicio impecable se entrelazan para crear
                una experiencia gastronómica inolvidable.
              </p>
              <div className="about-button">
                <Link href="/about" className="button">
                  Saber Más
                </Link>
              </div>
            </div>
            <div className="element-20 no-gutter knife">
              <Image
                src={KnifeImage.src}
                alt="cuchillo"
                height={KnifeImage.height}
                width={KnifeImage.width}
                priority
              />
            </div>
            <div className="element-40 history">
              <h2>Nuestra Historia</h2>
              <div className="spoon">
                <SponImage />
              </div>
              <p>
                En 2012, nuestro chef principal Kevin Luo junto a un grupo de
                amigos apasionados por la cocina, fundó GERÍCHT. Un lugar
                moderno ubicado en el corazón de Chicago.
              </p>
              <div className="history-button">
                <Link href="/about#our-history" className="button">
                  Saber Más
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
