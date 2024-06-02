import Image from "next/image";
import React from "react";
import styled from "styled-components";
import BG from "../../../../public/BG.svg";
import vitor from "../../../../public/find/vitor-pinto-bYSpfD0Wn04-unsplash 1.jpg";
import ImageContainer from "../../../imageContainer";
import SponImage from "../../../common/SponImage";

const FindUsWrapper = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  h2 {
    color: var(--golden);
  }
  padding: 40px 0;
  p.direction {
    margin-bottom: 40px;
  }
  h3.title {
    color: var(--golden);
  }
  .working-hours {
    margin-bottom: 50px;
  }
  .container {
    z-index: 2;
  }
  .seudo-image {
    position: absolute;
    z-index: 1;
    left: -10%;
    top: 10%;
    width: 80%;
    @media (max-width: 991px) {
      position: absolute;
      z-index: 1;
      left: auto;
      top: 34%;
      transform: rotate(90deg);

      right: -20%;
    }
  }
`;

function FindUs() {
  return (
    <FindUsWrapper id="find">
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
    </FindUsWrapper>
  );
}

export default FindUs;
