import BackgroundImage from "@/public/BG.svg";
import ImageContainer from "@/components/frontend/components/imageContainer/imageContainer";
import Image from "next/image";
import {SponImage} from "@/components/common";
import Chef from "@/public/chef/pexels-ron-lach-8879653 1.jpg";
import Quote from "@/public/quote.svg";
import Firm from "@/public/chef/Kevin Luo.png";
import './ourChef.scss'


export default function OurChef() {
  return (
    <section id="chef" style={{backgroundImage:`url(${BackgroundImage.src})`}}>
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
    </section>
  );
}
