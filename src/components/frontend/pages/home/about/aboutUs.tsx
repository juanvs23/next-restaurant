import Link from "next/link";
import Image from "next/image";

import BackgroundImage from "@/public/BG.svg";
import Gblack from "@/public/aboutus/g-black.svg";
import KnifeImage from "@/public/aboutus/savernake-knives-f4jl2ezowuM-unsplash 2.png";
import {SponImage} from "@/components/common";
import './aboutUs.scss';

export default function AboutUs() {
  return (
    <section id="aboutus"  style={{backgroundImage: `url(${BackgroundImage.src})`}}>
      <div className="about-container" style={{backgroundImage: `url(${Gblack.src})`}}>
        <div className="container">
          <div className="row">
            <div className="element-40 about">
              <h2>About Us</h2>
              <div className="spoon">
                <SponImage />
              </div>
              <p>
              Embark on a culinary journey at GERÍCHT, where exquisite flavors and impeccable service intertwine to create an unforgettable dining experience.
              </p>
              <div className="about-button">
                <Link href="/about" className="button">
                  Know More
                </Link>
              </div>
            </div>
            <div className="element-20 no-gutter knife">
              <Image
                src={KnifeImage.src}
                alt="knife"
                height={KnifeImage.height}
                width={KnifeImage.width}
                priority
              />
            </div>
            <div className="element-40 history">
              <h2>Our History</h2>
              <div className="spoon">
                <SponImage />
              </div>
              <p>
              In 2012 our principal and winner chef and experienced groups of friends with great passion for cook  was founded Gericht. A modern place with pleased locate in middle Heart of Chicago.

              </p>
              <div className="history-button">
                <Link href="/about#our-history" className="button">
                  Know More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
