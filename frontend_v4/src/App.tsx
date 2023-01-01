import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import LoginPage from "@/pages/LoginPage";
import HomePage from "@/pages/HomePage";
import MainPage from "@/pages/MainPage";

function App(): React.ReactElement {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="home" element={<HomePage />} />
          <Route path="main" element={<MainPage />} />
          <Route path="login" element={<LoginPage />} />
        </Route>
        // TODO: Not found page 만들어 넣기
        <Route path="/*" element={<div>404</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
