'use client'
import React from "react";
import styled from "styled-components";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { ImagesProps } from "@/types/sliders";
import { A11y } from "swiper/modules";
import { BsInstagram } from "react-icons/bs";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/effect-fade";


const InstagramCarousselWrapper = styled.div`
  .instagram-image {
    position: relative;
    .instagram-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      background: rgba(0, 0, 0, 0.5);
      background: linear-gradient(
        180deg,
        rgba(0, 0, 0, 0.3) 0%,
        rgba(0, 0, 0, 0.64) 54%,
        rgba(0, 0, 0, 0.8) 100%
      );
      cursor: pointer;
      transition: 0.3s all;
      svg {
        width: 44px;
        height: 44px;
      }
      &:hover {
        opacity: 1;
      }
    }
  }
`;

interface ImageProps {
  image: {
    src: string;
    url?: string;
    title?: string;
    height: number;
    width: number;
    blurDataUrl?: string;
  };
}

function ImageInstagram({ image }: ImageProps) {
  return (
    <article className="instagram-image">
      <Image
        src={image.src}
        width={image.width}
        height={image.height}
        alt="instagram"
        priority
      />
      <div className="instagram-overlay">
        <div className="instagrambuttom">
          <BsInstagram />
        </div>
      </div>
    </article>
  );
}

export default function InstagramCaroussel({ images }: ImagesProps) {
  return (
    <InstagramCarousselWrapper>
      <Swiper
        modules={[A11y]}
        spaceBetween={20}
        slidesPerView={4}
        loop={true}
        breakpoints={{
          // when window width is >= 640px
          0: {
            slidesPerView: 2,
          },
          // when window width is >= 768px
          768: {
            slidesPerView: 3,
          },
          992: {
            slidesPerView: 4,
          },
        }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
      >
        {images.map((image, i) => {
          return image.src !== undefined ? (
            <SwiperSlide key={i}>
              <ImageInstagram image={image} />
            </SwiperSlide>
          ) : (
            <></>
          );
        })}
      </Swiper>
    </InstagramCarousselWrapper>
  );
}
