"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useAppSelector, useAppDispatch } from "@/libs/store/hooks";
import { selectCartItems, selectSubtotalBs, clearCart } from "@/libs/store/slicers/cartSlicer";
import { formatVes } from "@/libs/currency";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";

const WHATSAPP_NUMBER = "584248310009";

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const ct = useTranslations("cart");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const subtotalBs = useAppSelector(selectSubtotalBs);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const canSubmit = name.trim() && phone.trim() && address.trim() && items.length > 0;

  const handleSubmit = async (paymentMethod: "whatsapp" | "stripe") => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/frontend/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name: name.trim(), email: email.trim() || undefined, phone: phone.trim() },
          items: items.map((i) => ({
            productId: i.productId,
            productName: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
          notes: `${t("deliveryAddress")}: ${address.trim()}${notes.trim() ? ". " + notes.trim() : ""}`,
          paymentMethod,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al crear el pedido");
      }

      const order = await res.json();
      setOrderId(order._id || order.orderNumber || "—");

      if (paymentMethod === "whatsapp") {
        const message = buildWhatsAppMessage(order, items, subtotalBs, { name, phone, address, notes }, t);
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
      }

      dispatch(clearCart());
    } catch (err: any) {
      setError(err.message || "Error al procesar el pedido");
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0 && !orderId) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="h-16 w-16 text-white2/20 mx-auto mb-4" />
        <h1 className="text-golden text-2xl font-serif mb-4">{t("emptyCart")}</h1>
        <Link href="/menu" className="text-golden hover:text-golden2 transition-colors">
          {ct("viewMenu")}
        </Link>
      </div>
    );
  }

  if (orderId) {
    return (
      <div className="container mx-auto max-w-lg px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-golden/20 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-golden" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-golden text-3xl font-serif mb-4">{t("orderReceived")}</h1>
        <p className="text-white2 mb-2">{t("orderNumber")}: <span className="text-golden font-semibold">{orderId}</span></p>
        <p className="text-white2/60 mb-8">{t("orderPending")}</p>
        <Link href="/menu" className="inline-block rounded-md bg-golden px-8 py-3 text-sm font-semibold text-black2 hover:bg-golden2 transition-colors">
          {t("continueShopping")}
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Link href="/menu" className="inline-flex items-center gap-1 text-sm text-white2/60 hover:text-golden transition-colors mb-8">
        <ArrowLeft className="h-4 w-4" />
        {t("backToMenu")}
      </Link>

      <h1 className="text-golden text-3xl font-serif mb-8">{t("title")}</h1>

      {/* Order summary */}
      <div className="bg-black2/40 border border-white2/10 rounded-lg p-4 mb-8">
        <h2 className="text-white2 font-semibold mb-4">{t("orderSummary")}</h2>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.productId} className="flex justify-between text-sm">
              <span className="text-white2">
                {item.quantity}x {item.name}
              </span>
              <span className="text-white2/60">{formatVes(item.priceBs * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-white2/10 mt-4 pt-4 flex justify-between text-lg font-semibold">
          <span className="text-white2">{ct("subtotal")}</span>
          <span className="text-golden">{formatVes(subtotalBs)}</span>
        </div>
      </div>

      {/* Customer form */}
      <div className="space-y-4 mb-8">
        <div>
          <label className="block text-sm text-white2/60 mb-1">{t("fullName")} *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-white2/20 bg-black2/60 px-4 py-2.5 text-white2 placeholder:text-white2/30 focus:border-golden/50 focus:outline-none"
            placeholder={t("fullNamePlaceholder")}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-white2/60 mb-1">{t("email")}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-white2/20 bg-black2/60 px-4 py-2.5 text-white2 placeholder:text-white2/30 focus:border-golden/50 focus:outline-none"
              placeholder={t("emailPlaceholder")}
            />
          </div>
          <div>
            <label className="block text-sm text-white2/60 mb-1">{t("phone")} *</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-md border border-white2/20 bg-black2/60 px-4 py-2.5 text-white2 placeholder:text-white2/30 focus:border-golden/50 focus:outline-none"
              placeholder="+58 412 1234567"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-white2/60 mb-1">{t("deliveryAddress")} *</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-md border border-white2/20 bg-black2/60 px-4 py-2.5 text-white2 placeholder:text-white2/30 focus:border-golden/50 focus:outline-none"
            placeholder={t("addressPlaceholder")}
          />
        </div>
        <div>
          <label className="block text-sm text-white2/60 mb-1">{t("notes")}</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full rounded-md border border-white2/20 bg-black2/60 px-4 py-2.5 text-white2 placeholder:text-white2/30 focus:border-golden/50 focus:outline-none resize-none"
            placeholder={t("notesPlaceholder")}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-6 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Payment buttons */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => handleSubmit("whatsapp")}
          disabled={!canSubmit || submitting}
          className="w-full rounded-md bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#1fa952] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {submitting ? (
            <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          )}
          {submitting ? t("processing") : t("whatsappPay")}
        </button>

        <button
          type="button"
          disabled
          className="w-full rounded-md border border-white2/20 bg-white2/5 px-6 py-3.5 text-sm font-semibold text-white2/40 cursor-not-allowed flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M22.5 9.5h-21v12h21v-12zm-19.5 10.5v-9h18v9h-18zm2-5.5h3v-2h-3v2zm5 0h3v-2h-3v2zm5 0h3v-2h-3v2z"/></svg>
          {t("stripeComing")}
        </button>
      </div>
    </div>
  );
}

function buildWhatsAppMessage(
  order: any,
  items: any[],
  subtotalBs: number,
  customer: { name: string; phone: string; address: string; notes: string },
  t: any
): string {
  const shortId = (order._id || "").slice(-8).toUpperCase();
  let msg = `🧾 *NUEVO PEDIDO — GERÍCHT*\n`;
  msg += `📦 #${shortId}\n\n`;
  msg += `👤 *Cliente:* ${customer.name}\n`;
  msg += `📞 *Teléfono:* ${customer.phone}\n`;
  msg += `📍 *Dirección:* ${customer.address}\n`;
  if (customer.notes) msg += `📝 *Notas:* ${customer.notes}\n`;
  msg += `\n📋 *Pedido:*\n`;
  items.forEach((item) => {
    msg += `  • ${item.quantity}x ${item.name} — ${formatVes(item.priceBs * item.quantity)}\n`;
  });
  msg += `\n💰 *Total:* ${formatVes(subtotalBs)}\n`;
  msg += `\n✅ *Confirmar pedido*`;
  return msg;
}
