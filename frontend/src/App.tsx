import PageTracker from "@/api/analytics/PageTracker";
import * as Sentry from "@sentry/react";
import React, { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AvailablePage from "@/Cabinet/pages/AvailablePage";
import ClubPage from "@/Cabinet/pages/ClubPage";
import CoinLogPage from "@/Cabinet/pages/CoinLogPage";
import HomePage from "@/Cabinet/pages/HomePage";
import InventoryPage from "@/Cabinet/pages/InventoryPage";
import ItemUsageLogPage from "@/Cabinet/pages/ItemUsageLogPage";
import Layout from "@/Cabinet/pages/Layout";
import LogPage from "@/Cabinet/pages/LogPage";
import LoginPage from "@/Cabinet/pages/LoginPage";
import MainPage from "@/Cabinet/pages/MainPage";
import PostLogin from "@/Cabinet/pages/PostLogin";
import ProfilePage from "@/Cabinet/pages/ProfilePage";
import StoreMainPage from "@/Cabinet/pages/StoreMainPage";
import AdminMainPage from "@/Cabinet/pages/admin/AdminMainPage";
import AdminSlackNotiPage from "@/Cabinet/pages/admin/AdminSlackNotiPage";
import AdminStorePage from "@/Cabinet/pages/admin/AdminStorePage";
import LoadingAnimation from "@/Cabinet/components/Common/LoadingAnimation";
import DetailPage from "@/Presentation/pages/DetailPage";
import PresentationHomePage from "@/Presentation/pages/HomePage";
import PresentationLayout from "@/Presentation/pages/Layout";
import PresentationLogPage from "@/Presentation/pages/LogPage";
import RegisterPage from "@/Presentation/pages/RegisterPage";
import AdminPresentationLayout from "@/Presentation/pages/admin/AdminLayout";

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
  const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);
  return (
    <BrowserRouter>
      {/* GA4 Page Tracking Component */}
      <PageTracker />
      <Suspense fallback={<LoadingAnimation />}>
        <SentryRoutes>
          <Route path="/post-login" element={<PostLogin />} />
          <Route path="/" element={<Layout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="home" element={<HomePage />} />
            <Route path="main" element={<MainPage />} />
            <Route path="available" element={<AvailablePage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="profile/log" element={<LogPage />} />
            <Route path="clubs" element={<ClubPage />} />
            <Route path="store" element={<StoreMainPage />} />
            <Route path="store/inventory" element={<InventoryPage />} />
            <Route path="store/item-use-log" element={<ItemUsageLogPage />} />
            <Route path="store/coin-log" element={<CoinLogPage />} />
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
            <Route path="slack-notification" element={<AdminSlackNotiPage />} />
            <Route path="available" element={<AvailablePage />} />
            <Route path="store" element={<AdminStorePage />} />
          </Route>
          <Route
            path="/admin/presentation/"
            element={<AdminPresentationLayout />}
          >
            <Route path="detail" element={<DetailPage />} />
          </Route>
          <Route path="/login/failure" element={<LoginFailurePage />} />
          <Route
            path="/admin/login/failure"
            element={<AdminLoginFailurePage />}
          />
          <Route path="/*" element={<NotFoundPage />} />
        </SentryRoutes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
