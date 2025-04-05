import React from "react";
import './ArrowComponent.scss'

type ArrowPaginationProps = {
  current: number;
  total: number;
  onClickPrev: () => void;
  onClickNext: () => void;
};

export const ArrowPagination = (props: ArrowPaginationProps) => {
  return (
    <div className="arrow-pagination flex gap-2 items-center mt-4">
      <button className="py-0 border-2 border-golden px-4 hover:bg-black hover:text-golden bg-golden text-black duration-300" type="button" onClick={props.onClickPrev}>
        Prev
      </button>
      <div className="arrow-pagination-label text-lg text-golden">
        {props.current} / {props.total}
      </div>
      <button className="py-0 border-2 border-golden px-4 hover:bg-black hover:text-golden bg-golden text-black duration-300" type="button" onClick={props.onClickNext}>
        Next
      </button>
    </div>
  );
};
