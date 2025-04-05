import type { Metadata, Viewport } from "next";
import './globals.css'
import {cormorant} from '@/components/common/fonts'
import Providers from "@/libs/providers";

export const metadata: Metadata = {
  title: "GERÍCHT - RESTAURANT",
  description: "the best restaurant in Berlin",
  metadataBase: new URL('https://acme.com'),
  openGraph: {
    title: "GERÍCHT - RESTAURANT",
    description: "the best restaurant in Berlin",
    url: "https://example.com",
    images: [{ url: "/gericht.png", width: 500, height: 500 }],
    siteName: "Gericht",
    locale: "en-US",
    type: "website",
  },
  icons: {
    icon: "/gericht.png",
  },
  authors: [{ name: "Juan Carlos Avila Pérez" }],
  creator: "Juan Carlos Avila Pérez",
};
export const viewport: Viewport = {
  themeColor: "#0c0b08",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cormorant.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
