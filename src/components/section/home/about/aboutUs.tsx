import styled from "styled-components";
import BackgroundImage from "../../../../public/BG.svg";
import Gblack from "../../../../public/aboutus/g-black.svg";
import Image from "next/image";
import KnifeImage from "../../../../public/aboutus/savernake-knives-f4jl2ezowuM-unsplash 2.png";
import SponImage from "../../../common/SponImage";

const AboutUsWrapper = styled.section`
  background-image: url(${BackgroundImage.src});
  display: flex;
  align-items: center;
  background-size: cover;
  h2 {
    color: var(--golden);
  }
  .container {
    justify-content: center;
    padding: 128px 0;
    .knife {
      width: 20%;
      max-width: 100px;
    }
  }
  .about-container {
    background-image: url(${Gblack.src});

    width: 100%;
    background-repeat: no-repeat;
    background-size: auto;
    background-position: center;
    align-items: center;
  }
  @media (max-width: 991px) {
    .container {
      .row {
        flex-flow: column;
      }
      justify-content: center;
      padding: 60px 0;
      .about {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        gap: 20px;
      }
      .history {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        gap: 20px;
      }

      .knife {
        transform: rotate(-90deg);
        height: auto;
        width: 114px !important;
        max-width: 11% !important;
        span {
          width: 100% !important;
          img {
            width: 100% !important;
          }
        }
      }
    }
  }
  @media (min-width: 992px) {
    .container {
      .about {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: end;
        text-align: right;
        gap: 20px;
      }
      .history {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: start;
        text-align: left;
        gap: 20px;
      }
    }
  }
`;

export default function AboutUs() {
  return (
    <AboutUsWrapper id="aboutus">
      <div className="about-container">
        <div className="container">
          <div className="row">
            <div className="element-40 about">
              <h2>About Us</h2>
              <div className="spoon">
                <SponImage />
              </div>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis
                pharetra adipiscing ultrices vulputate posuere tristique. In sed
                odio nec aliquet eu proin mauris et.
              </p>
              <div className="about-button">
                <a href="#" className="button">
                  Know More
                </a>
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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis
                pharetra adipiscing ultrices vulputate posuere tristique. In sed
                odio nec aliquet eu proin mauris et.
              </p>
              <div className="history-button">
                <a href="#" className="button">
                  Know More
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AboutUsWrapper>
  );
}
