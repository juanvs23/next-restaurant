"use client";
import { useState, useEffect } from "react";
import { getSlidesContents } from "@/libs/data/slidesContents";
import { SlideMenuSection } from "@/types/sections";
import BackgroundImage from "@/public/menu/bg.jpg";

// import Swiper core and required modules
import { Navigation, Pagination } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { SponImage } from "@/components/common";
import Image from "next/image";

import { Product } from "@/types/menu";

interface PropsSlide {
  slides: SlideMenuSection[];
}
interface PropsProduct {
  Product: Product;
}
const ProductMenu = ({ Product }: PropsProduct) => {
  const {
    title,

    specs: { ingredients, unit, sizes },
  } = Product;

  return (
    <div className="product">
      <div className="rowProduct">
        <h4 className="title">{title}</h4>
        <div className="price">
          <div className="separate"></div>
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(sizes[0].price)}
        </div>
      </div>
      <div className="rowProduct">
        <ul className="ingredients">
          {ingredients?.map((ingredient, i) => {
            return <li key={i}>{ingredient}</li>;
          })}
        </ul>
        {sizes.map((size, i) => (
          <p key={i} className="size">
            {size.name} {unit}
          </p>
        ))}
      </div>
    </div>
  );
};

const SliderMenu = ({ slides }: PropsSlide) => {
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      spaceBetween={0}
      slidesPerView={1}
      navigation
    >
      {slides.map((SlideData, i) => {
        return (
          <SwiperSlide key={i}>
            <div className="container-slide">
              <div className="row justify-center">
                <div className="text-center">
                  <p className="subtitle">{SlideData.subTitle}</p>
                  <SponImage />
                  <h2 className="title">{SlideData.title}</h2>
                </div>
              </div>
              <div className="row">
                <div className="element-30">
                  <h3>{SlideData.sectionA.title}</h3>
                  {SlideData.sectionA.products?.map((product, i) => (
                    <ProductMenu key={i} Product={product} />
                  ))}
                </div>
                <div className="element-30 no-gutter hidden lg:block">
                  <Image
                    src={SlideData.centerImage.src}
                    height={SlideData.centerImage.height}
                    width={SlideData.centerImage.width}
                    alt={SlideData.centerImage.title || ""}
                    priority
                  />
                </div>
                <div className="element-30">
                  <h3>{SlideData.sectionB.title}</h3>
                  {SlideData.sectionB.products?.map((product, i) => (
                    <ProductMenu key={i} Product={product} />
                  ))}
                </div>
                <div className="element-30 no-gutter lg:hidden">
                  <Image
                    src={SlideData.centerImage.src}
                    height={SlideData.centerImage.height}
                    width={SlideData.centerImage.width}
                    alt={SlideData.centerImage.title || ""}
                    priority
                  />
                </div>
              </div>
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default function MenuHome() {
  const [slidesContent, setSlidesContent] = useState<null | SlideMenuSection[]>(null);

  useEffect(() => {
    getSlidesContents().then(setSlidesContent);
  }, []);

  const ShowMenu =
    slidesContent !== null ? <SliderMenu slides={slidesContent} /> : <></>;
  return (
    <section id="menu" className="menu-home"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%), url(${BackgroundImage.src})`,
        backgroundSize: "cover",
      }}
    >
      <div className="container-menus">
        <div className="row">{ShowMenu}</div>
      </div>
    </section>
  );
}
