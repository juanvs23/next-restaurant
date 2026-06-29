"use client";
import Image from "next/image";
import logoTop from "@/public/awards/logo-87.svg";
import awardImga from "@/public/awards/mgg-vitchakorn-J5ZivsKiu9c-unsplash 2.jpg";
import G from "@/public/awards/G.svg";
import trophy1 from "@/public/awards/first-throphy.svg";
import trophy2 from "@/public/awards/second-throphy.svg";
import trophy3 from "@/public/awards/third-throphy.svg";
import trophy4 from "@/public/awards/fourth-throphy.svg";

import { SponImage } from "@/components/common";

const trophies = [
  { src: trophy1, title: "Bib Gourmond", desc: "Lorem ipsum dolor sit amet, consectetur." },
  { src: trophy2, title: "Bib Gourmond", desc: "Lorem ipsum dolor sit amet, consectetur." },
  { src: trophy3, title: "Bib Gourmond", desc: "Lorem ipsum dolor sit amet, consectetur." },
  { src: trophy4, title: "Bib Gourmond", desc: "Lorem ipsum dolor sit amet, consectetur." },
];

export default function AwardComponent() {
  return (
    <section id="awards" className="bg-overlay award-wrapper">
      <div className="container container-award">
        <div className="row">
          <div className="element-50">
            <Image src={logoTop.src} height={120} width={120} alt="GERÍCHT restaurant awards logo" />
            <div className="row-award">
              <h5>Awards & recognition</h5>
              <SponImage justify="start" />
              <h2>Our Laurels</h2>
              <div className="row-trophy">
                {trophies.map((t, i) => (
                  <div key={i} className="trophy">
                    <Image src={t.src.src} height={100} width={100} alt={`${t.title} award trophy`} />
                    <div className="text">
                      <h5>{t.title}</h5>
                      <p>{t.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="element-50">
            <div className="imageaWard">
              <div className="steak">
                <Image src={awardImga.src} height={awardImga.height} width={awardImga.width}                  alt="Filete a la parrilla con verduras" />
              </div>
              <div className="gImage">
                <Image src={G.src} height={G.height} width={G.width} alt="GERÍCHT ornamental letter G" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
