"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { ImagesProps } from "@/types/sliders";
import { A11y } from "swiper/modules";
import { BsInstagram } from "react-icons/bs";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

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
  onClick?: () => void;
}

function ImageInstagram({ image, onClick }: ImageProps) {
  return (
    <article className="relative cursor-pointer group" onClick={onClick}>
      <Image
        src={image.src}
        width={image.width}
        height={image.height}
        alt={image.title || "Galería GERÍCHT"}
      />
      <div className="instagram-overlay group-hover:opacity-100">
        <div className="instagrambuttom">
          <BsInstagram />
        </div>
      </div>
    </article>
  );
}

export default function InstagramCaroussel({ images }: ImagesProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const prev = () =>
    setLightboxIndex((i) => (i > 0 ? i - 1 : images.length - 1));
  const next = () =>
    setLightboxIndex((i) => (i < images.length - 1 ? i + 1 : 0));

  return (
    <div>
      <Swiper
        modules={[A11y]}
        spaceBetween={20}
        slidesPerView={4}
        loop={true}
        breakpoints={{
          0: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          992: { slidesPerView: 4 },
        }}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
      >
        {images.map((image, i) => {
          return image.src !== undefined ? (
            <SwiperSlide key={i}>
              <ImageInstagram
                image={image}
                onClick={() => openLightbox(i)}
              />
            </SwiperSlide>
          ) : (
            <React.Fragment key={i} />
          );
        })}
      </Swiper>

      {/* Lightbox */}
      {lightboxOpen && images[lightboxIndex] && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 z-10 text-white/70 hover:text-white p-2"
            onClick={closeLightbox}
            aria-label="Cerrar"
          >
            <X className="w-8 h-8" />
          </button>

          {images.length > 1 && (
            <>
              <button
                className="absolute left-4 z-10 text-white/70 hover:text-white p-2"
                onClick={(e) => { e.stopPropagation(); prev(); }}
                aria-label="Anterior"
              >
                <ChevronLeft className="w-10 h-10" />
              </button>
              <button
                className="absolute right-4 z-10 text-white/70 hover:text-white p-2"
                onClick={(e) => { e.stopPropagation(); next(); }}
                aria-label="Siguiente"
              >
                <ChevronRight className="w-10 h-10" />
              </button>
            </>
          )}

          <div
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex].src}
              alt={images[lightboxIndex].title || "Galería GERÍCHT"}
              width={images[lightboxIndex].width || 1200}
              height={images[lightboxIndex].height || 800}
              className="object-contain max-h-[90vh] rounded-lg"
            />
            {images[lightboxIndex].title && (
              <p className="text-center text-white2 mt-4 text-sm">
                {images[lightboxIndex].title}
              </p>
            )}
          </div>

          <div className="absolute bottom-6 text-white2/40 text-sm">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
}
