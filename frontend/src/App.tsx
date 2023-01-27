import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/pages/Layout";
import LoginPage from "@/pages/LoginPage";
import HomePage from "@/pages/HomePage";
import MainPage from "@/pages/MainPage";
import LoadingAnimation from "./components/Common/LoadingAnimation";
import LogPage from "@/pages/LogPage";
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));
const LoginFailurePage = lazy(() => import("@/pages/LoginFailurePage"));
const AdminLayout = lazy(() => import("@/pages/admin/AdminLayout"));
const AdminLoginPage = lazy(() => import("@/pages/admin/AdminLoginPage"));
const AdminHomePage = lazy(() => import("@/pages/admin/AdminHomePage"));
const AdminLogPage = lazy(() => import("@/pages/admin/AdminLogPage"));
const SearchPage = lazy(() => import("@/pages/admin/SearchPage"));

function App(): React.ReactElement {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingAnimation />}>
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
            <Route path="search" element={<SearchPage />} />
            <Route path="log" element={<AdminLogPage />} />
          </Route>
          <Route path="/login/failure" element={<LoginFailurePage />} />
          <Route path="/admin/login/failure" element={<LoginFailurePage />} />
          <Route path="/*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
