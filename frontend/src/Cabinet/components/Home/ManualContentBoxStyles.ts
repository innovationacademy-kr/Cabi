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
  color: var(--white-text-with-bg-color);
  position: relative;
  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 66.67%;
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
  @media screen and (max-width: 1000px) {
    width: 280px;
    font-size: 21px;
    &:after {
      left: 186.67px;
    }
  }
`;

export const coinBoxStyles = css`
  border: 5px solid var(--sys-main-color);
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
