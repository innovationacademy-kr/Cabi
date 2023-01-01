import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import HomePage from "@/pages/HomePage";
import MainPage from "@/pages/MainPage";
import { useSetRecoilState } from "recoil";
import { isMobileState, toggleNavState } from "./recoil/atoms";

function App(): React.ReactElement {
  const setIsMobile = useSetRecoilState(isMobileState);
  const setToggleNav = useSetRecoilState(toggleNavState);
  const mobileWidth = import.meta.env.VITE_MOBILE_WIDTH;

  const handleResize = () => {
    if (window.innerWidth < mobileWidth) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
      setToggleNav(false);
    }
  };

  useEffect(() => {
    window.innerWidth < mobileWidth ? setIsMobile(true) : setIsMobile(false);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/main" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
