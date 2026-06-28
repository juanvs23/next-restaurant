import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Producto no encontrado — GERÍCHT",
};

export default function MenuNotFound() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-white2/50">
        <Link href="/" className="hover:text-golden transition-colors">
          Inicio
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/menu" className="hover:text-golden transition-colors">
          Menú
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-white2/30">No encontrado</span>
      </nav>

      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="font-serif text-6xl font-bold text-golden/50">404</h1>
        <p className="mt-4 text-xl text-white2/70">
          Producto no encontrado
        </p>
        <p className="mt-2 text-sm text-white2/40">
          El producto que buscas no existe o ha sido removido del menú.
        </p>
        <Link
          href="/menu"
          className="mt-8 rounded-md bg-golden px-8 py-3 text-sm font-semibold text-black2 transition-colors hover:bg-golden2"
        >
          Ver menú completo
        </Link>
      </div>
    </div>
  );
}
