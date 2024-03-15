import React, { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AvailablePage from "@/Cabinet/pages/AvailablePage";
import ClubPage from "@/Cabinet/pages/ClubPage";
import HomePage from "@/Cabinet/pages/HomePage";
import Layout from "@/Cabinet/pages/Layout";
import LogPage from "@/Cabinet/pages/LogPage";
import LoginPage from "@/Cabinet/pages/LoginPage";
import MainPage from "@/Cabinet/pages/MainPage";
import PostLogin from "@/Cabinet/pages/PostLogin";
import ProfilePage from "@/Cabinet/pages/ProfilePage";
import AdminMainPage from "@/Cabinet/pages/admin/AdminMainPage";
import LoadingAnimation from "@/Cabinet/components/Common/LoadingAnimation";
import DetailPage from "@/Presentation/pages/DetailPage";
import PresentationHomePage from "@/Presentation/pages/HomePage";
import PresentationLayout from "@/Presentation/pages/Layout";
import PresentationLogPage from "@/Presentation/pages/LogPage";
import RegisterPage from "@/Presentation/pages/RegisterPage";

const NotFoundPage = lazy(() => import("@/Cabinet/pages/NotFoundPage"));
const LoginFailurePage = lazy(() => import("@/Cabinet/pages/LoginFailurePage"));
const AdminLayout = lazy(() => import("@/Cabinet/pages/admin/AdminLayout"));
const AdminLoginPage = lazy(
  () => import("@/Cabinet/pages/admin/AdminLoginPage")
);
const SearchPage = lazy(() => import("@/Cabinet/pages/admin/SearchPage"));
const AdminClubPage = lazy(() => import("@/Cabinet/pages/admin/AdminClubPage"));
const AdminLoginFailurePage = lazy(
  () => import("@/Cabinet/pages/admin/AdminLoginFailurePage")
);
const AdminHomePage = lazy(() => import("@/Cabinet/pages/admin/AdminHomePage"));

function App(): React.ReactElement {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingAnimation />}>
        <Routes>
          <Route path="/post-login" element={<PostLogin />} />
          <Route path="/" element={<Layout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="home" element={<HomePage />} />
            <Route path="main" element={<MainPage />} />
            <Route path="available" element={<AvailablePage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="profile/log" element={<LogPage />} />
            <Route path="clubs" element={<ClubPage />} />
          </Route>
          <Route path="/presentation/" element={<PresentationLayout />}>
            <Route path="home" element={<PresentationHomePage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="detail" element={<DetailPage />} />
            <Route path="log" element={<PresentationLogPage />} />
          </Route>
          {/* admin용 라우터 */}
          <Route path="/admin/" element={<AdminLayout />}>
            <Route path="login" element={<AdminLoginPage />} />
            <Route path="home" element={<AdminHomePage />} />
            <Route path="main" element={<AdminMainPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="club" element={<AdminClubPage />} />
            <Route path="available" element={<AvailablePage />} />
            <Route path="presentation/">
              <Route path="detail" element={<DetailPage />} />
            </Route>
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
