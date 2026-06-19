"use client";
import React from "react";

export default function GoToButton() {
  const [scroll, setScroll] = React.useState<number>(0);
  const handleScroll = () => {
    const position = window.pageYOffset;
    setScroll(position);
  };
  React.useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      {scroll > 700 ? (
        <a href="#" className="goTobutton">
          <span className="text-golden block px-1">TOP</span>
        </a>
      ) : (
        <a href="#aboutus" className="goTobutton">
          <span className="text-golden block px-1">SCROLL</span>
        </a>
      )}
    </div>
  );
}
