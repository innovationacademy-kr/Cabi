import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/pages/Layout";
import LoginPage from "@/pages/LoginPage";
import HomePage from "@/pages/HomePage";
import MainPage from "@/pages/MainPage";
const LogPage = React.lazy(() => import("@/pages/LogPage"));
const NotFoundPage = React.lazy(() => import("@/pages/NotFoundPage"));
const LoginFailurePage = React.lazy(() => import("@/pages/LoginFailurePage"));
const AdminLayout = React.lazy(() => import("@/pages/admin/AdminLayout"));
const AdminLoginPage = React.lazy(() => import("@/pages/admin/AdminLoginPage"));
const AdminHomePage = React.lazy(() => import("@/pages/admin/AdminHomePage"));

function App(): React.ReactElement {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="home" element={<HomePage />} />
          <Route path="main" element={<MainPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="log" element={<LogPage />} />
        </Route>
        {/* admin용 라우터 */}
        <Route path="/admin/" element={<AdminLayout />}>
          <Route path="login" element={<AdminLoginPage />} />
          <Route path="home" element={<AdminHomePage />} />
          <Route path="main" element={<MainPage />} />
        </Route>
        <Route path="/login/failure" element={<LoginFailurePage />} />
        <Route path="/admin/login/failure" element={<LoginFailurePage />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
