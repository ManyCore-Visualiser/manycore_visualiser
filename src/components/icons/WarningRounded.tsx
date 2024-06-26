import { SVGFunctionComponentT } from "./SVGFunctionComponentType";

const WarningRounded: SVGFunctionComponentT = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M4.126 20q-.234 0-.414-.111t-.28-.293q-.108-.179-.12-.387q-.01-.209.118-.421L11.3 5.212q.128-.212.308-.308T12 4.808t.391.096t.308.308l7.871 13.576q.128.212.117.42t-.12.388q-.1.182-.28.293t-.413.111zM12 17.615q.262 0 .438-.177q.177-.176.177-.438t-.177-.438t-.438-.177t-.438.177q-.177.176-.177.438t.177.438t.438.177m0-2.23q.213 0 .357-.144q.143-.144.143-.356v-4q0-.213-.144-.357q-.144-.143-.357-.143t-.356.143t-.143.357v4q0 .212.144.356t.357.144"
      ></path>
    </svg>
  );
};

export default WarningRounded;
