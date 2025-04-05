'use client'
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getSlidesContents } from "@/app/api/slidesContents";
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
import {SponImage} from "@/components/common";
import Image from "next/image";

import { Product } from "@/types/menu";

const MenuHomeWrapper = styled.section`
  background-image: url(${BackgroundImage.src});
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 120px 30px;
  .container-slide {
    margin: auto;
    max-width: 1300px;
  }
  .swiper-button-next,
  .swiper-button-prev {
    color: var(--golden);
    &.swiper-button-disabled {
      display: none;
    }
  }

  .row {
    justify-content: center;
  }
  .product {
    margin-bottom: 40px;
    .rowProduct {
      p.size {
        font-size: 0.7rem;
      }
      .price {
        font-family: "Cormorant Upright";
        font-size: 1.3rem;
        color: var(--white);
      }
      p.price,
      p.size {
        margin: 0;
        display: flex;
        line-height: 1;
        align-items: center;
        .separate {
          width: 120px;
          height: 1px;
          border-top: 1px solid var(--white2);
          margin-right: 10px;
        }
      }
      ul.ingredients {
        list-style: none;
        display: flex;
        justify-content: flex-start;
        padding-inline-start: 0;
        flex-flow: wrap;
        margin: 0;
        li {
          padding: 0 5px;
          border-right: 1px solid var(--white2);
          line-height: 1;
          font-size: 0.7rem;
          &:last-of-type {
            border-right: none;
          }
        }
      }
      display: flex;
      align-items: center;
      gap: 10px;
      justify-content: space-between;
      h4.title {
        color: var(--golden);
      }
    }
  }
  h2 {
    text-align: center;
    color: var(--golden);
    letter-spacing: 2px;
    margin-bottom: 20px;
  }
  .swiper-slide {
    width: 100% !important;
    .row {
      align-items: flex-start;
    }
    .container-slide h3 {
      text-align: center;
      color: white;
      font-size: 2.8rem;
    }
  }
  p.subtitle {
    text-align: center;
    font-family: "Cormorant Upright";
    font-size: 22px;
    line-height: 1;
    color: var(--white);
  }
  .container-menus {
    max-width: 90%;
  }
  @media (max-width: 991px) {
    padding: 60px 10px;
    .container-menus {
      max-width: 100%;
    }
  }
  @media (min-width: 992px) {
    h2 {
      font-size: 3.5rem;
      color: var(--golden);
      letter-spacing: 2px;
      margin-bottom: 20px;
    }
  }
`;
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
                <div className="element-30 no-gutter onlyDesktop">
                  <Image
                    src={SlideData.centerImage.src}
                    height={SlideData.centerImage.height}
                    width={SlideData.centerImage.width}
                    alt={SlideData.centerImage.title||''}
                    priority
                  />
                </div>
                <div className="element-30">
                  <h3>{SlideData.sectionB.title}</h3>
                  {SlideData.sectionB.products?.map((product, i) => (
                    <ProductMenu key={i} Product={product} />
                  ))}
                </div>
                <div className="element-30 no-gutter onlyMobil">
                  <Image
                    src={SlideData.centerImage.src}
                    height={SlideData.centerImage.height}
                    width={SlideData.centerImage.width}
                    alt={SlideData.centerImage.title||''}
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
  const [slidesContent, setslidesContent] = useState<null | SlideMenuSection[]>(
    null,
  );

  useEffect(() => {
    setslidesContent(getSlidesContents());
  }, []);

  const ShowMenu =
    slidesContent !== null ? <SliderMenu slides={slidesContent} /> : <></>;
  return (
    <MenuHomeWrapper id="menu">
      <div className="container-menus">
        <div className="row">{ShowMenu}</div>
      </div>
    </MenuHomeWrapper>
  );
}
