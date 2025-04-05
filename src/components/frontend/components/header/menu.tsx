import Link from "next/link";
import { routes } from "@/routes";

import './scss/menu.scss';

export default function Menu() {
  return (
    <ul className="menu-wrapper">
      {routes.map((link, i) => {
        return (
          <li key={i} className={`links `}>
            <Link href={`${link.path}`}>{link.title}</Link>
          </li>
        );
      })}
    </ul>
  );
}
