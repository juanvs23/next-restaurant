import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, EffectFade, A11y } from "swiper";
import styled from "styled-components";

import Image1 from "../../public/hero/image-1.jpg";
import Image2 from "../../public/hero/image-2.jpg";
import Image3 from "../../public/hero/image-3.jpg";
import Image4 from "../../public/hero/image-4.jpg";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/effect-fade";
import ImageContainer from "../imageContainer";

const SliderWrappper = styled.div`
  .swiper-pagination {
    position: relative;
    display: flex;
    color: white;
    font-size: 17px;
    padding-top: 30px;
    padding-bottom: 20px;
  }
  .swiper.swiper-initialized {
    display: flex;
    flex-direction: column-reverse;
  }

  span.hero-counter {
    color: var(--white);
    opacity: 1;
    background: transparent;
    font-family: Cormorant Upright;
    font-size: 1.5rem;
    padding: 8px;
    height: auto;
    width: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
  }
  span.hero-counter.swiper-pagination-bullet-active:after {
    content: "";
    display: block;
    height: 1px;
    width: 17px;
    background: var(--golden);
  }
`;

export default function SliderComponent() {
  const images = [Image1, Image2, Image3, Image4];
  const customPaginate = {
    clickable: true,
    renderBullet: function (index: number, className: string) {
      return `<span class="${className} hero-counter"> 0${index + 1} </span> `;
    },
  };
  return (
    <SliderWrappper>
      <Swiper
        modules={[Pagination, EffectFade, A11y]}
        spaceBetween={0}
        slidesPerView={1}
        effect={"fade"}
        pagination={customPaginate}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}

        //onSwiper={(swiper) => console.log(swiper)}
        // onSlideChange={() => console.log('slide change')}
      >
        {images.map((image, i) => {
          return (
            <SwiperSlide key={i}>
              <ImageContainer
                url={image.src}
                altTitle={`products`}
                widthProps={image.width}
                heightProps={image.height}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </SliderWrappper>
  );
}
