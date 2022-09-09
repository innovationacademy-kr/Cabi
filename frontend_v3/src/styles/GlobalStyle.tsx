import { Global, css } from "@emotion/react";

const style = css`
  html {
    font-size: 1rem;
    max-width: 30rem;
    margin: auto;
  }

  body {
    background: -webkit-linear-gradient(to bottom, #6667ab, #6c337d);
    background: linear-gradient(to bottom, #6667ab, #6c337d);
    padding: 3%;
    justify-content: center;
    font-family: "EliceDigitalBaeum_Regular";
    height: 100vh;
    margin: 0;
  }
`;

export default function GlobalStyle(): JSX.Element {
  return <Global styles={style} />;
}
