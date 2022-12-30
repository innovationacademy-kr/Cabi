import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import HomePage from "@/pages/HomePage";
import MainPage from "@/pages/MainPage";
import { useRecoilState } from "recoil";
import { isMobileState, toggleNavState } from "./recoil/atoms";

function App(): React.ReactElement {
  const [isMobile, setIsMobile] = useRecoilState(isMobileState);
  const [toggleNav, setToggleNav] = useRecoilState(toggleNavState);

  const handleResize = () => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
      setToggleNav(false);
    }
  };

  useEffect(() => {
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
