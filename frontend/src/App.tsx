import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/pages/Layout";
import LoginPage from "@/pages/LoginPage";
import HomePage from "@/pages/HomePage";
import MainPage from "@/pages/MainPage";
import NotFoundPage from "@/pages/NotFoundPage";
import LoginFailurePage from "@/pages/LoginFailurePage";

function App(): React.ReactElement {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="home" element={<HomePage />} />
          <Route path="main" element={<MainPage />} />
          <Route path="login/" element={<LoginPage />} />
        </Route>
        {/* admin용 라우터 */}
        <Route path="/admin/" element={<Layout />}>
          <Route path="home" element={<HomePage />} />
          <Route path="main" element={<MainPage />} />
          <Route path="login" element={<LoginPage />} />
        </Route>
        <Route path="/login/failure" element={<LoginFailurePage />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
