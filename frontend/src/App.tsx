import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import LoginPage from "@/pages/LoginPage";
import HomePage from "@/pages/HomePage";
import MainPage from "@/pages/MainPage";
import NotFoundPage from "@/pages/NotFoundPage";

function App(): React.ReactElement {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="home" element={<HomePage />} />
          <Route path="main" element={<MainPage />} />
          <Route path="login" element={<LoginPage />} />
        </Route>
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
