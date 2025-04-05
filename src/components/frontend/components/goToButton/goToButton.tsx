"use client";
import React from "react";
import styled from "styled-components";

const GoToButtonWrapper = styled.div`
  .goTobutton {
    position: fixed;
    bottom: 20%;
    right: 8vw;
    cursor: pointer;
    background: transparent;
    border: none;
    text-decoration: none;
    z-index: 99;
    &:focus {
      outline: none;
    }

    &:before {
      content: "";
      margin: auto;
      display: block;
      height: 61px;
      width: 1px;
      background: var(--golden);
    }
    span {
      color: var(--golden);
      padding: 5px;
      display: block;
    }
  }
`;
export default function GoToButton() {
  const [scroll, setScroll] = React.useState<number>(0);
  React.useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScroll = () => {
    const position = window.pageYOffset;
    setScroll(position);
  };

  return (
    <GoToButtonWrapper>
      {scroll > 700 ? (
        <a href="#" className="goTobutton">
          <span>TOP</span>
        </a>
      ) : (
        <a href="#aboutus" className="goTobutton">
          <span>SCROLL</span>
        </a>
      )}
    </GoToButtonWrapper>
  );
}
