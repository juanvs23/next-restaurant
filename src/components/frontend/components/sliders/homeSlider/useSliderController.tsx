import { useState, useEffect } from "react";
import { SwiperClass } from "swiper/react";

interface SliderImage {
  src: string;
  width: number;
  height: number;
}

export function useSliderController() {
  const [images, setImages] = useState<SliderImage[]>([]);
  const [controlledSwiper, setControlledSwiper] = useState<SwiperClass | null>(
    null,
  );
  const [activeIndex, setActiveIndex] = useState(1);

  useEffect(() => {
    fetch("/api/frontend/media?category=hero&limit=8")
      .then((r) => r.json())
      .then((data: any[]) => {
        const mapped = data.map((m) => ({
          src: m.url,
          width: m.width || 435,
          height: m.height || 435,
        }));
        if (mapped.length > 0) setImages(mapped);
      })
      .catch(() => {});
  }, []);

  const handleSlideChange = (): void => {
    if (!controlledSwiper) return;
    setActiveIndex(controlledSwiper?.snapIndex + 1 || 0);
  };

  return {
    controlledSwiper,
    setControlledSwiper,
    activeIndex,
    setActiveIndex,
    handleSlideChange,
    images,
  };
}
