import CenterImage from "@/public/menu/cocktell.webp";
import { SlideMenuSection } from "@/types/sections";

export const getSlidesContents = async (): Promise<SlideMenuSection[]> => {
  const res = await fetch("/api/menu-slides");
  const slides: SlideMenuSection[] = await res.json();

  return slides.map((slide) => ({
    ...slide,
    centerImage: {
      src: CenterImage.src,
      width: CenterImage.width,
      height: CenterImage.height,
      title: "Drinks",
    },
  }));
};
