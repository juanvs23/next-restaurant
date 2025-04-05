import Image from "next/image";
import React from "react";
import BG from "@/public/BG.svg";
import vitor from "@/public/find/vitor-pinto-bYSpfD0Wn04-unsplash 1.jpg";
import ImageContainer from "@/components/frontend/components/imageContainer/imageContainer";
import {SponImage} from "@/components/common";

import './findUs.scss'



function FindUs() {
  return (
    <section id="find">
      <div className="container">
        <div className="row">
          <div className="element-50">
            <div className="info-content">
              <h3>Contact</h3>
              <SponImage justify="start" />
              <h2>Find Us</h2>
              <p className="direction">
                Lane Ends Bungalow, Whatcroft Hall Lane, Rudheath, CW9 7SG
              </p>
              <div className="working-hours">
                <h3 className="title">Opening Hours</h3>
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
      <div className="seudo-image">
        <Image
          src={BG.src}
          className="seudo-bg"
          alt={BG.blurDataURL}
          width={BG.width}
          height={BG.height}
        />
      </div>
    </section>
  );
}

export default FindUs;
