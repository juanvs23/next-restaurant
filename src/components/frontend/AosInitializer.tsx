"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AosInitializer() {
  useEffect(() => {
    AOS.init({
      duration: 400,
      easing: "ease-out",
      once: true,
    });
  }, []);

  return null;
}
