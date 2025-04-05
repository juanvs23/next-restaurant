import type { Metadata } from "next";
import { Components } from "@/components/frontend";

import "@/components/frontend/styles/global-styles.scss";

export const metadata: Metadata = {
  title: "GERÍCHT - RESTAURANT",
  description: "the best restaurant in Berlin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
       <>
        <Components.Header />
        {children}
        <Components.Footer />
       </>
  );
}
