import { useState } from "react";
import { SwiperClass } from "swiper/react";


import Image1 from "@/public/hero/image-1.jpg";
import Image2 from "@/public/hero/image-2.jpg";
import Image3 from "@/public/hero/image-3.jpg";
import Image4 from "@/public/hero/image-4.jpg";

export function useSliderController() {

    const images = [Image1, Image2, Image3, Image4];
    const [controlledSwiper, setControlledSwiper] = useState<SwiperClass|null>(null);
    const [activeIndex, setActiveIndex] = useState(1);
    const handleSlideChange = (): void => {
        if (!controlledSwiper) return;
         
        setActiveIndex(controlledSwiper?.snapIndex + 1 || 0)
        }
    return { controlledSwiper, setControlledSwiper, activeIndex, setActiveIndex, handleSlideChange,images };
}