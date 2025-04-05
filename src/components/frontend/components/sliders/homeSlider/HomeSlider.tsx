'use client'
import { useState } from "react";
import { Swiper, SwiperSlide, SwiperClass  } from "swiper/react";
import { Pagination, EffectFade, A11y,Controller } from "swiper/modules";


import styled from "styled-components";
import ImageContainer from "@/components/frontend/components/imageContainer/imageContainer";


// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/effect-fade";
import { ArrowPagination } from "./ArrowComponent";
import { useSliderController } from "./useSliderController";

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

export default function HomeSlider() {
  const {controlledSwiper, setControlledSwiper, activeIndex, handleSlideChange, images} = useSliderController()
 

  return (
    <>
    <SliderWrappper>
      <Swiper
        modules={[Pagination, EffectFade, A11y,Controller]}
        spaceBetween={0}
        slidesPerView={1}
        controller={{ control: controlledSwiper }}
        onSwiper={(swiper) => setControlledSwiper(swiper)}
        effect={"fade"}
        onSlideChange={handleSlideChange}
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
    <ArrowPagination 
      current={activeIndex} 
      total={images.length} 
      onClickPrev={() => controlledSwiper?.slidePrev()} 
      onClickNext={() => controlledSwiper?.slideNext()} />
    </>
  );
}
