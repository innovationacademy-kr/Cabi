import { Global, css } from "@emotion/react";

const style = css`
  @font-face {
    font-family: "EliceDigitalBaeum_Regular";
    src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2105_2@1.0/EliceDigitalBaeum_Regular.woff")
      format("woff");
    font-weight: normal;
    font-style: normal;
  }

  html {
    font-size: 1rem;
    max-width: 30rem;
    margin: auto;
  }

  body {
    background: -webkit-linear-gradient(to bottom, #6667ab, #6c337d);
    background: linear-gradient(to bottom, #6667ab, #6c337d);
    justify-content: center;
    height: 100vh;
    margin: 0;
    font-family: "EliceDigitalBaeum_Regular";
  }
`;

export default function GlobalStyle(): JSX.Element {
  return <Global styles={style} />;
}
