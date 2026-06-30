"use client";

import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/libs/store/hooks";
import {
  selectCartItems,
  selectSubtotalBs,
  removeItem,
  updateQuantity,
  clearCart,
} from "@/libs/store/slicers/cartSlicer";
import { formatVes } from "@/libs/currency";
import { useCart } from "./CartContext";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

export default function CartSheet() {
  const t = useTranslations("cart");
  const { isCartOpen, setCartOpen } = useCart();
  const items = useAppSelector(selectCartItems);
  const subtotalBs = useAppSelector(selectSubtotalBs);
  const dispatch = useAppDispatch();

  const handleQuantity = (productId: string, delta: number) => {
    const item = items.find((i) => i.productId === productId);
    if (!item) return;
    dispatch(updateQuantity({ productId, quantity: item.quantity + delta }));
  };

  const ITEM_LIMIT = 99;

  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetContent side="right" className="flex flex-col bg-black2 border-golden/20">
        <SheetHeader>
          <SheetTitle className="text-golden text-xl font-serif">
            {t("title")}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-white2">
            <ShoppingBag className="h-12 w-12 text-white2/40" />
            <p className="text-lg">{t("empty")}</p>
            <SheetClose asChild>
              <Link
                href="/menu"
                className="rounded-md bg-golden px-6 py-2 text-sm font-semibold text-black2 transition-colors hover:bg-golden2"
              >
                {t("viewMenu")}
              </Link>
            </SheetClose>
          </div>
        ) : (
          <>
            {/* Items list */}
            <div className="flex-1 space-y-4 overflow-y-auto py-4">
              {items.map((item) => {
                const itemSubtotal = item.priceBs * item.quantity;
                const atMin = item.quantity <= 1;
                const atMax = item.quantity >= ITEM_LIMIT;

                return (
                  <div
                    key={item.productId}
                    className="flex gap-3 rounded-lg border border-white2/10 p-3"
                  >
                    {/* Thumbnail */}
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-white2/10">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-white2/30 text-xs">
                          {t("noImage")}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/menu/${item.slug}`}
                          className="text-sm font-medium text-white2 hover:text-golden transition-colors line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => dispatch(removeItem(item.productId))}
                          className="flex-shrink-0 text-white2/40 hover:text-red-400 transition-colors"
                          aria-label={t("remove", { name: item.name })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-golden">
                          {formatVes(item.priceBs)} {t("perUnit")}
                        </span>
                        <span className="text-sm font-semibold text-white2">
                          {formatVes(itemSubtotal)}
                        </span>
                      </div>

                      {/* Quantity controls */}
                      <div className="mt-1 flex items-center gap-2">
                        <button
                          type="button"
                          disabled={atMin}
                          onClick={() => handleQuantity(item.productId, -1)}
                          className="flex h-6 w-6 items-center justify-center rounded border border-white2/20 text-white2 disabled:opacity-30 hover:border-golden/50 transition-colors"
                          aria-label={t("quantityDecrease")}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-sm text-white2">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          disabled={atMax}
                          onClick={() => handleQuantity(item.productId, 1)}
                          className="flex h-6 w-6 items-center justify-center rounded border border-white2/20 text-white2 disabled:opacity-30 hover:border-golden/50 transition-colors"
                          aria-label={t("quantityIncrease")}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="border-t border-white2/10 pt-4 space-y-3">
              <div className="flex items-center justify-between text-lg">
                <span className="text-white2">{t("subtotal")}</span>
                <span className="font-semibold text-golden">
                  {formatVes(subtotalBs)}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => dispatch(clearCart())}
                  className="rounded-md border border-white2/20 px-4 py-2 text-sm text-white2 hover:border-red-400/50 hover:text-red-400 transition-colors"
                >
                  {t("clear")}
                </button>

                <SheetClose asChild>
                  <Link
                    href={items.length > 0 ? "/checkout" : "#"}
                    className={`flex-1 rounded-md py-2 text-center text-sm font-semibold transition-colors ${
                      items.length > 0
                        ? "bg-golden text-black2 hover:bg-golden2"
                        : "bg-white2/10 text-white2/40 pointer-events-none"
                    }`}
                  >
                    {t("checkout")}
                  </Link>
                </SheetClose>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
