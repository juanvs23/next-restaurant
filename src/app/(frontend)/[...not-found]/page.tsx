import type { Metadata } from "next";
import { Pages } from "@/components/frontend";

export const metadata: Metadata = {
  title: "Upss Sorry - Not Found", 
  description: "Gerisht, the best restaurant in Berlin - This page does not exist",
};
export default function Home() {
    return (
     <Pages.NotFound/>
    );
  }
  