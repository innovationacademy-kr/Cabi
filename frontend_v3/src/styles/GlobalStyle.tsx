import { Global, css } from "@emotion/react";

const style = css`
  html {
    font-size: 16px;
    max-width: 480px;
    margin: auto;
  }

  body {
    font-family: "EliceDigitalBaeum_Regular";
    padding: 0;
    margin: 0;
  }
`;

export default function GlobalStyle(): JSX.Element {
  return <Global styles={style} />;
}
