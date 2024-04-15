import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { createGlobalStyle, css } from "styled-components";
import { darkModeState } from "@/recoil/atoms";

export const lightValues = css`
  --text: var(--blue);
`;

// set up dark theme CSS variables
export const darkValues = css`
  --text: var(--pink);
`;

const GlobalStyle = createGlobalStyle`
  :root {
    // define light theme values as the defaults within the root selector
    ${lightValues}

    [color-theme="true"] {
      ${darkValues}
    }
  }
`;

const DarkMode = () => {
  const [darkMode, setDarkMode] = useRecoilState(darkModeState);
  const onClickHandler = () => {
    setDarkMode((prev) => {
      return prev === "light" ? "dark" : "light";
    });
  };

  useEffect(() => {
    document.body.setAttribute("color-theme", darkMode);
  }, [darkMode]);

  return <button onClick={onClickHandler}>mode change</button>;
};

export default DarkMode;
