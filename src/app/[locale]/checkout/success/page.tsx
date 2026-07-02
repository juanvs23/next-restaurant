"use client";

import { useTranslations } from "next-intl";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  const t = useTranslations("checkout");

  return (
    <div className="container mx-auto max-w-lg px-4 py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-8 h-8 text-green-500" />
      </div>
      <h1 className="text-golden text-3xl font-serif mb-4">
        {t("paymentSuccess")}
      </h1>
      <p className="text-white2 mb-2">
        {t("paymentSuccessDesc")}
      </p>
      <p className="text-white2/60 mb-8">
        {t("paymentSuccessInfo")}
      </p>
      <Link
        href="/menu"
        className="inline-block rounded-md bg-golden px-8 py-3 text-sm font-semibold text-black2 hover:bg-golden2 transition-colors"
      >
        {t("continueShopping")}
      </Link>
    </div>
  );
}
