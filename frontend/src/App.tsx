import React, { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import Layout from "@/pages/Layout";
import LogPage from "@/pages/LogPage";
import LoginPage from "@/pages/LoginPage";
import MainPage from "@/pages/MainPage";
import AdminMainPage from "@/pages/admin/AdminMainPage";
import LoadingAnimation from "@/components/Common/LoadingAnimation";

const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));
const LoginFailurePage = lazy(() => import("@/pages/LoginFailurePage"));
const AdminLayout = lazy(() => import("@/pages/admin/AdminLayout"));
const AdminLoginPage = lazy(() => import("@/pages/admin/AdminLoginPage"));
const SearchPage = lazy(() => import("@/pages/admin/SearchPage"));
const AdminLoginFailurePage = lazy(
  () => import("@/pages/admin/AdminLoginFailurePage")
);
const AdminHomePage = lazy(() => import("@/pages/admin/AdminHomePage"));

function App(): React.ReactElement {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingAnimation />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="home" element={<HomePage />} />
            <Route path="main" element={<MainPage />} />
            <Route path="log" element={<LogPage />} />
          </Route>
          {/* admin용 라우터 */}
          <Route path="/admin/" element={<AdminLayout />}>
            <Route path="login" element={<AdminLoginPage />} />
            <Route path="home" element={<AdminHomePage />} />
            <Route path="main" element={<AdminMainPage />} />
            <Route path="search" element={<SearchPage />} />
          </Route>
          <Route path="/login/failure" element={<LoginFailurePage />} />
          <Route
            path="/admin/login/failure"
            element={<AdminLoginFailurePage />}
          />
          <Route path="/*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
