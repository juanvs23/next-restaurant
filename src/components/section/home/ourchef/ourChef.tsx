import styled from "styled-components";
import BackgroundImage from "../../../../public/BG.svg";
import ImageContainer from "../../../imageContainer";
import Image from "next/image";
import SponImage from "../../../common/SponImage";
import Chef from "../../../../public/chef/pexels-ron-lach-8879653 1.jpg";
import Quote from "../../../../public/quote.svg";
import Firm from "../../../../public/chef/Kevin Luo.png";

const OurChefWrapper = styled.section`
  background-image: url(${BackgroundImage.src});
  display: flex;
  align-items: center;
  background-size: cover;
  padding: 120px 10px;
  p.subtitle {
    font-size: 1.5rem;
    font-family: "Cormorant Upright";
    color: var(--white);
  }
  .firmImage {
    max-width: 235px;
  }
  h5 {
    font-family: "Open Sans";
    font-weight: 400;
    margin-bottom: 60px;
    color: var(--white2);
  }
  h3 {
    color: var(--golden);
    letter-spacing: 2px;
    font-size: 2.3rem;
    margin-bottom: 10px;
  }
  h2.title {
    font-size: 4rem;
    color: var(--golden);
    margin-bottom: 3rem;
    letter-spacing: 4px;
  }
  p.text-Chef {
    text-align: justify;
    font-size: 1rem;
    line-height: 2;
    font-style: italic;
    margin-bottom: 40px;
    span {
      margin-right: 10px !important;
      width: 40px !important;
      height: auto !important;
    }
  }
  @media (max-width: 991px) {
    padding: 60px 10px;
  }
`;

export default function OurChef() {
  return (
    <OurChefWrapper id="chef">
      <div className="container">
        <div className="row">
          <div className="element-50">
            <ImageContainer
              url={Chef.src}
              altTitle={"Kevin Luo"}
              heightProps={Chef.height}
              widthProps={Chef.width}
            />
          </div>
          <div className="element-50">
            <p className="subtitle">Chef’s Word</p>
            <SponImage justify="start" />
            <h2 className="title">What we believe in</h2>
            <p className="text-Chef">
              <Image
                src={Quote.src}
                height={Quote.height}
                width={Quote.width}
                alt={"Quote"}
              />
              auctor sit iaculis in arcu. Vulputate nulla lobortis mauris eget
              sit. Nulla scelerisque scelerisque congue ac consequat, aliquam
              molestie lectus eu. Congue iaculis integer curabitur semper sit
              nunc.
            </p>
            <h3>Kevin Luo</h3>
            <h5>Chef & Founder</h5>
            <div className="firmImage">
              <Image
                src={Firm.src}
                height={Firm.height}
                width={Firm.width}
                alt={"Kevin Luo"}
              />
            </div>
          </div>
        </div>
      </div>
    </OurChefWrapper>
  );
}
