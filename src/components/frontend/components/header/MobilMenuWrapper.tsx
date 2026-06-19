"use client";

import dynamic from "next/dynamic";

const MobilMenu = dynamic(() => import("./MobilMenu"), {
  ssr: false,
});

export default function MobilMenuWrapper() {
  return <MobilMenu />;
}
