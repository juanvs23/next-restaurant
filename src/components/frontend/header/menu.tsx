"use client";
import styled from "styled-components";
import Link from "next/link";
import { routes } from "@/routes";

const MenuWrapper = styled.ul`
  list-style: none;
  padding-inline-start: 0;
  margin: 0;
  li {
    padding: 5px;
    transition: 0.5s all ease-in-out;
    border-bottom: 2px solid transparent;
  }
  li:hover {
    padding: 5px;
    transition: 0.5s all ease-in-out;
    border-bottom: 2px solid var(--golden);
  }
  a {
    color: white;
    text-decoration: none;
  }
`;
export default function Menu() {
  return (
    <MenuWrapper>
      {routes.map((link, i) => {
        return (
          <li key={i} className={`links `}>
            <Link href={`${link.path}`}>{link.title}</Link>
          </li>
        );
      })}
    </MenuWrapper>
  );
}
