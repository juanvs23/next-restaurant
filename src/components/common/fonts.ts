import { Cormorant, Montserrat, Open_Sans } from "next/font/google";

export const montSerrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const cormorant = Cormorant({
  subsets: ["latin"],
  variable: "--font-cormorant",
});

export const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});
