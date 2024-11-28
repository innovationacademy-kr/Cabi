import { css } from "styled-components";

export const extensionBoxStyles = css`
  width: 900px;
  color: var(--normal-text-color);
  @media screen and (max-width: 1000px) {
    width: 280px;
    font-size: 21px;
  }
`;

export const storeBoxStyles = css`
  width: 620px;
  height: 280px;
  position: relative;
  background: linear-gradient(
    to bottom,
    var(--ref-purple-300),
    var(--ref-purple-600)
  );
  border-radius: 40px;
  clip-path: path(
    "M 0 163.33
    A 23.33 23.33 1 0 0 0 116.67
    L 0 0
    L 396.56 0
    L 413.354 15.67
    L 430.148 0
    L 620 0
    L 620 280
    L 430.148 280
    L 413.354 264.33
    L 396.56 280
    L 0 280
    Z"
  );
  /* Explanation of path:
  - M 0 175: Move to (0, 175)
  - A 25 25 1 0 0 0 125: Draw an arc with radius 25, starting from (0, 175) to (0, 125) // radius-x, radius-y, x-axis-rotation, large-arc-flag, sweep-flag, x, y
  - L 0 0: Draw a line from (0, 125) to (0, 0)
  - L 396.56 0: Draw a line from (0, 0) to (396.56, 0)
  - L 413.354 16.794: Draw a line from (396.56, 0) to (413.354, 16.794)
  - L 430.148 0: Draw a line from (413.354, 16.794) to (430.148, 0)
  - L 620 0: Draw a line from (430.148, 0) to (620, 0)
  - L 620 300: Draw a line from (620, 0) to (620, 300)
  - L 430.148 300: Draw a line from (620, 300) to (430.148, 300)
  - L 413.354 283.206: Draw a line from (430.148, 300) to (413.354, 283.206)
  - L 396.56 300: Draw a line from (413.354, 283.206) to (396.56, 300)
  - L 0 300: Draw a line from (396.56, 300) to (0, 300)
  - Z: Close the path
  */
  &:after {
    content: "";
    position: absolute;
    top: 25px;
    right: 32.99%; /* 2/3 point */
    height: 100%;
    width: 4px;
    background-image: linear-gradient(
      to bottom,
      white 33%,
      rgba(255, 255, 255, 0) 0%
    );
    background-position: right;
    background-size: 10px 30px;
    background-repeat: repeat-y;
  }
  @media screen and (max-width: 1100px) {
    width: 280px;
    font-size: 21px;
    clip-path: none;

    &:after {
      display: none;
    }
  }
`;

export const coinBoxStyles = css`
  border: 5px solid var(--sys-default-main-color);
  color: var(--sys-main-color);
`;

export const pendingBoxStyles = css`
  border: 6px double var(--sys-main-color);
  box-shadow: inset 0px 0px 0px 5px var(--bg-color);
`;

export const inSessionBoxStyles = css`
  border: 5px solid var(--sys-main-color);
  color: var(--sys-main-color);
`;

export const privateBoxStyles = css`
  /* border: 5px solid var(--sys-main-color);
  color: var(--sys-main-color); */
`;
