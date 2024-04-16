import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { darkModeState } from "@/recoil/atoms";

const DarkMode = () => {
  const [darkMode, setDarkMode] = useRecoilState(darkModeState);
  const onClickHandler = () => {
    setDarkMode((prev) => {
      return prev === "light" ? "dark" : "light";
    });
  };

  var darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");

  useEffect(() => {
    setDarkMode(() => {
      return darkModeQuery.matches ? "dark" : "light";
    });
  }, []);

  useEffect(() => {
    document.body.setAttribute("color-theme", darkMode);
  }, [darkMode]);

  return <button onClick={onClickHandler}>mode change</button>;
};

export default DarkMode;
