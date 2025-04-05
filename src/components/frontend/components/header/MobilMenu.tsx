"use client";
import styled from "styled-components";
import { AiOutlineMenu } from "react-icons/ai";
import { BsXLg } from "react-icons/bs";
import { useState } from "react";
import { motion } from "framer-motion";
import Menu from "./menu";
const MobileWrapper = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  inset: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 10px;
  background: var(--black2);
  z-index: 999;

  button.closer {
    appearance: none;
    border: none;
    background: transparent;
    position: absolute;
    right: 20px;
    top: 20px;
  }
`;
const MobileContainer = styled.div`
  ul {
    flex-direction: column;
    width: 100%;
    li {
      width: 100%;
      height: 50px;
      border: 2px solid transparent;
      text-align: center;
      transition: 0.5s all ease-in-out;
      &:hover {
        background: var(--golden);
      }
    }
  }

  button {
    appearance: none;
    border: none;
    background: transparent;
    color: white;
    transition: 0.5s all ease-in-out;
    &:hover {
      color: var(--golden);
    }
  }

  @media (min-width: 992px) {
    display: none;
  }
`;

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
    <MobileContainer>
      <button className="openeer" type="button" onClick={handlerClick}>
        <AiOutlineMenu color="white" size="2rem" />
      </button>

      <MobileWrapper
        animate={isOpen ? "open" : "closed"}
        variants={variants}
        transition={{ duration: 0.5 }}
        className={isOpen ? "active" : ""}
      >
        <motion.button
          animate={{ rotate: hovered ? 40 : 0 }}
          transition={{ duration: 0.2 }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="closer"
          type="button"
          onClick={handlerClick}
        >
          <BsXLg color="white" size="2rem" />
        </motion.button>
        <Menu />
      </MobileWrapper>
    </MobileContainer>
  );
}
