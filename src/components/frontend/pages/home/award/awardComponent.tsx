'use client'
import Image from "next/image";
import styled from "styled-components";
import logoTop from "@/public/awards/logo-87.svg";
import awardImga from "@/public/awards/mgg-vitchakorn-J5ZivsKiu9c-unsplash 2.jpg";
import G from "@/public/awards/G.svg";
import trophy1 from "@/public/awards/first-throphy.svg";
import trophy2 from "@/public/awards/second-throphy.svg";
import trophy3 from "@/public/awards/third-throphy.svg";
import trophy4 from "@/public/awards/fourth-throphy.svg";

import {SponImage} from "@/components/common";
import bg from "@/public/BG.svg";

const AwardWrapper = styled.section`
  background: url(${bg.src});
  background-size: cover;
  .row-trophy {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    .trophy {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
      h5 {
        color: var(--golden);
      }
      p {
        color: var(--white2);
        margin-bottom: 0;
      }
    }
  }
  .container-award {
    padding-top: 50px;
    padding-bottom: 70px;
    .row-award {
      h2 {
        color: var(--golden);
        margin-bottom: 25px;
      }
      margin-left: 20%;
      margin-top: 16%;
      .row-award .row-content {
        height: 100%;
        /* display: flex; */
        margin-top: 11%;
        width: 100%;
      }
    }
    .row {
      align-items: flex-start;
      .imageaWard {
        position: relative;
        .gImage {
          position: absolute;
          bottom: 0;
          left: 0;
        }
        .steak {
          padding-left: 10%;
          padding-top: 10%;
        }
      }
    }
  }
  @media (max-width: 991px) {
    .container-award {
      .row-award {
        margin-left: 0;
        margin-top: 16%;
      }
    }
  }
`;
export default function AwardComponent() {
  return (
    <AwardWrapper id="awards">
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
                    <Image src={trophy1.src} height={100} width={100}  alt="logo" />
                  </div>
                  <div className="text">
                    <h5>Bib Gourmond</h5>
                    <p>Lorem ipsum dolor sit amet, consectetur.</p>
                  </div>
                </div>
                <div className="trophy">
                  <div className="image">
                    <Image src={trophy2.src} height={100} width={100} alt="logo" />
                  </div>
                  <div className="text">
                    <h5>Bib Gourmond</h5>
                    <p>Lorem ipsum dolor sit amet, consectetur.</p>
                  </div>
                </div>
                <div className="trophy">
                  <div className="image">
                    <Image src={trophy3.src} height={100} width={100} alt="logo" />
                  </div>
                  <div className="text">
                    <h5>Bib Gourmond</h5>
                    <p>Lorem ipsum dolor sit amet, consectetur.</p>
                  </div>
                </div>
                <div className="trophy">
                  <div className="image">
                    <Image src={trophy4.src} height={100} width={100}  alt="logo"/>
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
                <Image src={G.src} height={G.height} width={G.width} alt="logo" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AwardWrapper>
  );
}
