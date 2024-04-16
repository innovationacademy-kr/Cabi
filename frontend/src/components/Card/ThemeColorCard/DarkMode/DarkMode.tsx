import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { darkModeState } from "@/recoil/atoms";

// TODO : DarkMode 파일 폴더명 ColorTheme으로 변경

const DarkMode = () => {
  const savedColorTheme = localStorage.getItem("color-theme");
  var darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
  // const [darkMode, setDarkMode] = useRecoilState(darkModeState);
  const [darkMode, setDarkMode] = useState(
    savedColorTheme ? savedColorTheme : darkModeQuery.matches ? "dark" : "light"
  );

  const onClickHandler = () => {
    setDarkMode((prev) => {
      return prev === "light" ? "dark" : "light";
    });
  };

  useEffect(() => {
    darkModeQuery.addEventListener("change", (event) =>
      setDarkMode(event.matches ? "dark" : "light")
    );
  }, []);

  useEffect(() => {
    document.body.setAttribute("color-theme", darkMode);
    localStorage.setItem("color-theme", darkMode);
  }, [darkMode]);

  return (
    <>
      <ButtonStyled onClick={onClickHandler}>mode change</ButtonStyled>
    </>
  );
};

const ButtonStyled = styled.button`
  background-color: var(--normal-text-color);
`;

export default DarkMode;
