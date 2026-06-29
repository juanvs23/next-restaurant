"use client";
import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { ImagesProps } from "@/types/sliders";
import { A11y } from "swiper/modules";
import { BsInstagram } from "react-icons/bs";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/effect-fade";

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
    <article className="relative">
      <Image
        src={image.src}
        width={image.width}
        height={image.height}
        alt="Imagen de galería de Instagram del restaurante GERÍCHT"
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
    <div>
      <Swiper
        modules={[A11y]}
        spaceBetween={20}
        slidesPerView={4}
        loop={true}
        breakpoints={{
          0: {
            slidesPerView: 2,
          },
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
    </div>
  );
}
