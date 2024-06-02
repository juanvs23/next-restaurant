import Image from "next/image";

import { ImageProps } from "../models/React";
import Rectangle from "../public/rectangle-21.svg";

import React from "react";
import styled from "styled-components";

const ImageWrapper = styled.div`
  position: relative;
  padding: 15px;
  img.rectangle {
    position: absolute;
    max-width: 100%;
  }
  span {
    z-index: 10;
  }
  img.rectangle-1 {
    top: 0;
    right: 0;
  }
  img.rectangle-2 {
    bottom: 0;
    left: 0;
  }
  @media (max-width: 768px) {
    img.rectangle {
      position: absolute;
      max-width: 100%;
      width: 45%;
      height: 45%;
    }
  }
`;

function ImageContainer({
  url,
  altTitle,
  heightProps,
  widthProps,
}: ImageProps) {
  return (
    <ImageWrapper className="images-containers">
      <img
        src={Rectangle.src}
        className="rectangle-1 rectangle"
        alt={Rectangle.blurDataURL}
        width={Rectangle.width}
        height={Rectangle.height}
      />

      <Image
        src={url}
        alt={altTitle}
        width={widthProps}
        height={heightProps}
        priority
      />
      <img
        src={Rectangle.src}
        className="rectangle-2 rectangle"
        alt={Rectangle.blurDataURL}
        width={Rectangle.width}
        height={Rectangle.height}
      />
    </ImageWrapper>
  );
}

export default ImageContainer;
