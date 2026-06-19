import Link from "next/link";
import { routes } from "@/routes";

export default function Menu() {
  return (
    <ul className="list-none p-0 m-0 flex items-center gap-1">
      {routes.map((link, i) => {
        return (
          <li key={i} className="p-1 transition-all duration-500 border-b-2 border-transparent hover:border-golden hover:bg-golden lg:hover:bg-transparent h-[50px] w-full text-center">
            <Link href={`${link.path}`} className="text-white no-underline">{link.title}</Link>
          </li>
        );
      })}
    </ul>
  );
}
