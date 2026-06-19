import type { Metadata } from "next";
import { Components } from "@/components/frontend";

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
