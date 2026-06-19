import React from "react";
import vitor from "@/public/find/vitor-pinto-bYSpfD0Wn04-unsplash 1.jpg";
import ImageContainer from "@/components/frontend/components/imageContainer/imageContainer";
import { SponImage } from "@/components/common";

function FindUs() {
  return (
    <section id="find" className="flex items-center justify-center relative py-24">
      <div className="container z-[2]">
        <div className="row">
          <div className="element-50">
            <div className="info-content">
              <h3 className="text-golden">Contact</h3>
              <SponImage justify="start" />
              <h2 className="text-golden">Find Us</h2>
              <p className="direction mb-10">
                Lane Ends Bungalow, Whatcroft Hall Lane, Rudheath, CW9 7SG
              </p>
              <div className="working-hours mb-12">
                <h3 className="title text-golden">Opening Hours</h3>
                <p className="opening">Mon - Fri: 10:00 am - 02:00 am</p>
                <p className="closing">Sat - Sun: 10:00 am - 03:00 am</p>
              </div>
              <a href="#footer" className="button">
                Visit Us
              </a>
            </div>
          </div>
          <div className="element-50">
            <ImageContainer
              url={vitor.src}
              altTitle={`products`}
              widthProps={vitor.width}
              heightProps={vitor.height}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default FindUs;
