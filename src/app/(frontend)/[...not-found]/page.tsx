import type { Metadata } from "next";
import { Pages } from "@/components/frontend";

export const metadata: Metadata = {
  title: "Página no encontrada — GERÍCHT",
  description:
    "GERÍCHT, el mejor restaurante de Chicago — Esta página no existe",
};
export default function Home() {
  return <Pages.NotFound />;
}
