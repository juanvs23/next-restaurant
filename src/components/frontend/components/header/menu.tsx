import { useTranslations } from "next-intl";
import Link from "next/link";

const routeKeys = [
  { path: "/", key: "home" },
  { path: "/about", key: "about" },
  { path: "/menu", key: "menu" },
  { path: "/about#chef", key: "chef" },
  { path: "/gallery", key: "gallery" },
  { path: "/#awards", key: "awards" },
  { path: "/#find", key: "findUs" },
] as const;

export default function Menu() {
  const t = useTranslations("nav");

  return (
    <ul className="list-none p-0 m-0 flex lg:flex-row flex-col items-center gap-1">
      {routeKeys.map((link, i) => {
        return (
          <li key={i} className="p-1 transition-all duration-500 border-b-2 border-transparent hover:border-golden hover:bg-golden lg:hover:bg-transparent lg:h-auto h-[50px] lg:w-auto w-full text-center">
            <Link href={link.path} className="text-white no-underline">{t(link.key)}</Link>
          </li>
        );
      })}
    </ul>
  );
}
