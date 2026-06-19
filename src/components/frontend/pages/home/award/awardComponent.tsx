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

export default function AwardComponent() {
  return (
    <section id="awards" className="bg-overlay award-wrapper">
      <div className="container container-award">
        <div className="row">
          <div className="element-50">
            <Image src={logoTop.src} height={120} width={120} alt="logo" />
            <div className="row-award">
              <h5>Awards & recognition</h5>
              <SponImage justify="start" />
              <h2>Our Laurels</h2>
              <div className="row-trophy">
                <div className="trophy">
                  <div className="image">
                    <Image
                      src={trophy1.src}
                      height={100}
                      width={100}
                      alt="logo"
                    />
                  </div>
                  <div className="text">
                    <h5>Bib Gourmond</h5>
                    <p>Lorem ipsum dolor sit amet, consectetur.</p>
                  </div>
                </div>
                <div className="trophy">
                  <div className="image">
                    <Image
                      src={trophy2.src}
                      height={100}
                      width={100}
                      alt="logo"
                    />
                  </div>
                  <div className="text">
                    <h5>Bib Gourmond</h5>
                    <p>Lorem ipsum dolor sit amet, consectetur.</p>
                  </div>
                </div>
                <div className="trophy">
                  <div className="image">
                    <Image
                      src={trophy3.src}
                      height={100}
                      width={100}
                      alt="logo"
                    />
                  </div>
                  <div className="text">
                    <h5>Bib Gourmond</h5>
                    <p>Lorem ipsum dolor sit amet, consectetur.</p>
                  </div>
                </div>
                <div className="trophy">
                  <div className="image">
                    <Image
                      src={trophy4.src}
                      height={100}
                      width={100}
                      alt="logo"
                    />
                  </div>
                  <div className="text">
                    <h5>Bib Gourmond</h5>
                    <p>Lorem ipsum dolor sit amet, consectetur.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="element-50">
            <div className="imageaWard">
              <div className="steak">
                <Image
                  src={awardImga.src}
                  height={awardImga.height}
                  width={awardImga.width}
                  alt="logo"
                />
              </div>
              <div className="gImage">
                <Image
                  src={G.src}
                  height={G.height}
                  width={G.width}
                  alt="logo"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
