import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { darkModeState } from "@/recoil/atoms";
import MultiToggleSwitch from "@/components/Common/MultiToggleSwitch";
import MultiToggleSwitchSeparated from "@/components/Common/MultiToggleSwitchSeparated";

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
  const [toggleType, setToggleType] = useState("ALL");
  // "ALL"
  // setToggleType
  // [{name: '전체', key: 'ALL'}, {name: '전체', key: 'ALL'}]

  return (
    <>
      <ButtonsWrapperStyled>
        <MultiToggleSwitchSeparated
          initialState={toggleType}
          setState={setToggleType}
          toggleList={[
            { name: "전체", key: 0 },
            { name: "전체", key: 0 },
            { name: "전체", key: 0 },
          ]}
          buttonHeight={"90px"}
          buttonWidth={"90px"}
        ></MultiToggleSwitchSeparated>
      </ButtonsWrapperStyled>
    </>
  );
};

const ButtonsWrapperStyled = styled.div`
  display: flex;
  justify-content: center;
  padding: 0 16px;
`;

const ButtonStyled = styled.button`
  background-color: var(--normal-text-color);
`;

export default DarkMode;
