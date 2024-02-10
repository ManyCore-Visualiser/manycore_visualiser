import React from "react";
import type { SVGProps } from "react";
import { SVGFunctionComponentT } from "../SVGFunctionComponentType";

const TwotoneMemory: SVGFunctionComponentT = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 164 164"
      {...props}
    >
      {/* TODO: Improve this path by giving it rounded corners for better animation */}
      <path
        stroke="currentColor"
        d="M118.5 45.5H45.5V119H118.5V45.5Z"
        opacity={0.3}
        strokeWidth={22}
        fill="transparent"
      ></path>
      <path
        stroke="currentColor"
        d="M27.5003 64V36.5C27.5003 36.5 27.515 32.4853 30.0003 30C32.4855 27.5147 36.5003 27.5 36.5003 27.5H64M27.5003 64H0.251953M27.5003 64V100M0.254825 100H27.5003M27.5003 100V127.5C27.5003 127.5 27.515 131.515 30.0003 134C32.4855 136.485 36.5003 136.5 36.5003 136.5H64.0003M64.0003 163.755V136.5M64.0003 136.5H100M100 163.755V136.5M100 136.5H127.5C127.5 136.5 131.515 136.485 134 134C136.486 131.515 136.5 127.5 136.5 127.5V100M163.743 100H136.5M136.5 100V64M163.753 64H136.5M136.5 64V36.5C136.5 36.5 136.486 32.4853 134 30C131.515 27.5147 127.5 27.5 127.5 27.5H100M100 0.25824V27.5M100 27.5H64M64 0.25824V27.5M64 64H100V100H64V64Z"
        strokeWidth={18.7}
        fill="transparent"
      ></path>
    </svg>
  );
};

export default TwotoneMemory;
