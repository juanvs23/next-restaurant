"use client";

import { ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAppDispatch } from "@/libs/store/hooks";
import { addItem } from "@/libs/store/slicers/cartSlicer";
import { formatVes } from "@/libs/currency";
import { useAppSelector } from "@/libs/store/hooks";
import { selectCartItems } from "@/libs/store/slicers/cartSlicer";
import { cn } from "@/lib/utils";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, EffectFade, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "swiper/css/navigation";

// ── Types ──

interface ProductCardProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  priceBs: number;
  images?: string[];
  description?: string;
}

interface ProductCardProps {
  product: ProductCardProduct;
}

// ── Component ──

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const images = product.images?.length ? product.images : [];
  const firstImage = images[0];

  const inCart = items.find((i) => i.productId === product._id);
  const cartQty = inCart?.quantity ?? 0;

  const handleAdd = () => {
    dispatch(
      addItem({
        productId: product._id,
        name: product.name,
        price: product.price,
        priceBs: product.priceBs,
        quantity: 1,
        image: firstImage ?? "",
        slug: product.slug,
      })
    );
  };

  return (
    <div
      className={cn(
        "group flex flex-col overflow-hidden rounded-lg border border-white2/10",
        "bg-black2/60 shadow-sm transition-all duration-300",
        "hover:shadow-lg"
      )}
    >
      {/* Image carousel */}
      <Link
        href={`/menu/${product.slug}`}
        className="relative aspect-[4/3] overflow-hidden"
      >
        {images.length > 0 ? (
          images.length === 1 ? (
            <Image
              src={images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
            />
          ) : (
            <Swiper
              modules={[Pagination, EffectFade, Navigation]}
              effect="fade"
              speed={800}
              navigation
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              loop
              className="card-swiper h-full w-full"
            >
              {images.map((src, i) => (
                <SwiperSlide key={i}>
                  <Image
                    src={src}
                    alt={`${product.name} - ${i + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white2/5">
            <ImageIcon className="h-10 w-10 text-white2/20" />
          </div>
        )}
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link href={`/menu/${product.slug}`}>
          <h3 className="font-serif text-lg font-semibold text-golden transition-colors group-hover:text-golden2 line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {product.description && (
          <p className="text-sm text-white2/60 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-white2">
            {formatVes(product.priceBs)}
          </span>

          <button
            type="button"
            onClick={handleAdd}
            className={cn(
              "rounded-md px-4 py-1.5 text-sm font-semibold transition-all duration-200",
              "bg-golden text-black2 hover:bg-golden2 active:scale-95"
            )}
          >
            {cartQty > 0 ? `Agregado (${cartQty})` : "Agregar"}
          </button>
        </div>
      </div>
      <style jsx>{`
        .card-swiper .swiper-button-next,
        .card-swiper .swiper-button-prev {
          color: #f5efdb;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .card-swiper:hover .swiper-button-next,
        .card-swiper:hover .swiper-button-prev {
          opacity: 0.9;
        }
        .card-swiper .swiper-button-next:hover,
        .card-swiper .swiper-button-prev:hover {
          opacity: 1;
        }
        .card-swiper .swiper-button-next::after,
        .card-swiper .swiper-button-prev::after {
          font-size: 1rem;
          font-weight: bold;
          text-shadow: 0 0 6px rgba(0,0,0,0.6);
        }
        .card-swiper .swiper-pagination-bullet {
          background: #f5efdb;
          opacity: 0.4;
        }
        .card-swiper .swiper-pagination-bullet-active {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
