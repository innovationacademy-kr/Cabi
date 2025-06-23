import PageTracker from "@/api/analytics/PageTracker";
import * as Sentry from "@sentry/react";
import React, { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AGUPage from "@/Cabinet/pages/AGUPage";
import HomePage from "@/Cabinet/pages/HomePage";
import Layout from "@/Cabinet/pages/Layout";
import LoginPage from "@/Cabinet/pages/LoginPage";
import PostLogin from "@/Cabinet/pages/PostLogin";
import LoadingAnimation from "@/Cabinet/components/Common/LoadingAnimation";

const LoginFailurePage = lazy(() => import("@/Cabinet/pages/LoginFailurePage"));
const NotFoundPage = lazy(() => import("@/Cabinet/pages/NotFoundPage"));
const AvailablePage = lazy(() => import("@/Cabinet/pages/AvailablePage"));
const ClubPage = lazy(() => import("@/Cabinet/pages/ClubPage"));
const CoinLogPage = lazy(() => import("@/Cabinet/pages/CoinLogPage"));
const InventoryPage = lazy(() => import("@/Cabinet/pages/InventoryPage"));
const ItemUsageLogPage = lazy(() => import("@/Cabinet/pages/ItemUsageLogPage"));
const LogPage = lazy(() => import("@/Cabinet/pages/LogPage"));
const MainPage = lazy(() => import("@/Cabinet/pages/MainPage"));
const ProfilePage = lazy(() => import("@/Cabinet/pages/ProfilePage"));
const StoreMainPage = lazy(() => import("@/Cabinet/pages/StoreMainPage"));

// NOTE : 수요지식회
const PresentationHomePage = lazy(
  () => import("@/Presentation/pages/HomePage")
);
const PresentationDetailPage = lazy(
  () => import("@/Presentation/pages/PresentationDetailPage")
);
const PresentationLayout = lazy(() => import("@/Presentation/pages/Layout"));
const DetailPage = lazy(() => import("@/Presentation/pages/DetailPage"));
const AboutUsPage = lazy(() => import("@/Presentation/pages/AboutUsPage"));
const RegisterPage = lazy(() => import("@/Presentation/pages/RegisterPage"));
const PresentationProfilePage = lazy(
  () => import("@/Presentation/pages/ProfilePage")
);

// NOTE : admin
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
const AdminMainPage = lazy(() => import("@/Cabinet/pages/admin/AdminMainPage"));
const AdminSlackAlarmPage = lazy(
  () => import("@/Cabinet/pages/admin/AdminSlackAlarmPage")
);
const AdminStorePage = lazy(
  () => import("@/Cabinet/pages/admin/AdminStorePage")
);
const AdminPresentationLayout = lazy(
  () => import("@/Presentation/pages/admin/adminLayout")
);
const AdminPresentationHomePage = lazy(
  () => import("@/Presentation/pages/admin/AdminHomePage")
);

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
            <Route path="agu" element={<AGUPage />} />
          </Route>
          <Route path="/presentations/" element={<PresentationLayout />}>
            <Route path="home" element={<PresentationHomePage />} />
            <Route
              path=":presentationId"
              element={<PresentationDetailPage />}
            />
            <Route path="register" element={<RegisterPage />} />
            <Route
              path="register/:presentationId"
              element={<RegisterPage />}
            />
            <Route path="detail" element={<DetailPage />} />
            <Route path="about" element={<AboutUsPage />} />
            <Route path="profile" element={<PresentationProfilePage />} />
          </Route>
          {/* admin용 라우터 */}
          <Route path="/admin/" element={<AdminLayout />}>
            <Route path="login" element={<AdminLoginPage />} />
            <Route path="home" element={<AdminHomePage />} />
            <Route path="main" element={<AdminMainPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="club" element={<AdminClubPage />} />
            <Route path="slack-alarm" element={<AdminSlackAlarmPage />} />
            <Route path="available" element={<AvailablePage />} />
            <Route path="store" element={<AdminStorePage />} />
          </Route>
          <Route
            path="/admin/presentations/"
            element={<AdminPresentationLayout />}
          >
            <Route path="home" element={<AdminPresentationHomePage />} />
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
