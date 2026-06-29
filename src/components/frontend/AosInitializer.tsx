"use client";

import { useEffect, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

let initialized = false;

export default function AosInitializer() {
  const doneRef = useRef(false);

  useEffect(() => {
    if (doneRef.current) return;
    doneRef.current = true;

    if (!initialized) {
      AOS.init({
        duration: 400,
        easing: "ease-out",
        once: true,
      });
      initialized = true;
    } else {
      AOS.refreshHard();
    }

    return () => {
      // Never cleanup — AOS is a global singleton
    };
  }, []);

  return null;
}
