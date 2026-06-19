"use client";
import { useState } from "react";
import { Swiper, SwiperSlide, SwiperClass } from "swiper/react";
import { Pagination, EffectFade, A11y, Controller } from "swiper/modules";

import ImageContainer from "@/components/frontend/components/imageContainer/imageContainer";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/effect-fade";
import { ArrowPagination } from "./ArrowComponent";
import { useSliderController } from "./useSliderController";

export default function HomeSlider() {
  const {
    controlledSwiper,
    setControlledSwiper,
    activeIndex,
    handleSlideChange,
    images,
  } = useSliderController();

  return (
    <>
      <div>
        <Swiper
          modules={[Pagination, EffectFade, A11y, Controller]}
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
      </div>
      <ArrowPagination
        current={activeIndex}
        total={images.length}
        onClickPrev={() => controlledSwiper?.slidePrev()}
        onClickNext={() => controlledSwiper?.slideNext()}
      />
    </>
  );
}
