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
    <div className="bg-black2 min-h-screen text-white2">
      <Components.Header />
      {children}
      <Components.Footer />
    </div>
  );
}
