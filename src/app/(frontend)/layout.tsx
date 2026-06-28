import type { Metadata } from "next";
import { Components, CartHydrator, CartSheet, CartPersister } from "@/components/frontend";

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
      <CartHydrator />
      <CartPersister />
      <Components.Header />
      {children}
      <Components.Footer />
      <CartSheet />
    </div>
  );
}
