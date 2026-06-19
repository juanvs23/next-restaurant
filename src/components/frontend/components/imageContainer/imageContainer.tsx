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
      <Image
        src={Rectangle}
        className="rectangle-1 rectangle"
        alt=""
        role="presentation"
      />

      <Image
        src={url}
        alt={altTitle}
        width={widthProps}
        height={heightProps}
        priority
        className="image-product"
      />
      <Image
        src={Rectangle}
        className="rectangle-2 rectangle"
        alt=""
        role="presentation"
      />
    </article>
  );
}
