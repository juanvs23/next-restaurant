
import Image from "next/image";

import { ImageProps } from "@/types/React";
import Rectangle from "@/public/rectangle-21.svg";
import "./imagenContainer.scss";



export default function ImageContainer({
  url,
  altTitle,
  heightProps,
  widthProps,
}: ImageProps) {
  return (
    <article className="images-containers image-container-wrapper">
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
        className="image-product"
      />
      <img
        src={Rectangle.src}
        className="rectangle-2 rectangle"
        alt={Rectangle.blurDataURL}
        width={Rectangle.width}
        height={Rectangle.height}
      />
    </article>
  );
}

