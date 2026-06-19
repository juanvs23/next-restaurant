"use client";
import { AiOutlineMenu } from "react-icons/ai";
import { BsXLg } from "react-icons/bs";
import { useState } from "react";
import { motion } from "framer-motion";
import Menu from "./menu";

const variants = {
  open: { opacity: 1, x: 0, transitionEnd: { display: "block" } },
  closed: { opacity: 0, x: "100%", transitionEnd: { display: "none" } },
};

export default function MobilMenu() {
  const [isOpen, setIsopen] = useState<Boolean>(false);
  const [hovered, setHovered] = useState<Boolean>(false);
  const handlerClick = () => {
    setIsopen((isOpen) => !isOpen);
  };
  return (
    <div className="lg:hidden">
      <button className="openeer" type="button" onClick={handlerClick}>
        <AiOutlineMenu color="white" size="2rem" />
      </button>

      <motion.nav
        animate={isOpen ? "open" : "closed"}
        variants={variants}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 inset-0 w-full h-full flex justify-center items-center flex-col gap-2.5 bg-black2 z-[999]"
      >
        <motion.button
          animate={{ rotate: hovered ? 40 : 0 }}
          transition={{ duration: 0.2 }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="appearance-none border-none bg-transparent absolute right-5 top-5"
          type="button"
          onClick={handlerClick}
        >
          <BsXLg color="white" size="2rem" />
        </motion.button>
        <div>
          <ul className="flex-col w-full">
            <Menu />
          </ul>
        </div>
      </motion.nav>
    </div>
  );
}
