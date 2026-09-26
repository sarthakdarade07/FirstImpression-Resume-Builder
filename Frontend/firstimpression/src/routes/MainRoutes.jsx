import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../protectedPath/ProtectedRoutes";
import { routes } from "./routes";

// Lazy-load all page components
const HomePage = lazy(() => import("../pages/HomePage"));
const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));
const AccountPage = lazy(() => import("../pages/AccountPage"));
const AuthPage = lazy(() => import("../pages/AuthPage"));
const ResumeStudioPage = lazy(() => import("../pages/ResumeStudioPage"));
const FeaturesPage = lazy(() => import("../pages/FeaturesPage"));
const AboutUsPage = lazy(() => import("../pages/AboutUsPage"));
const Page404 = lazy(() => import("../pages/Page404"));

import CentralLoader from "../pages/CentralLoader";

function MainRoutes() {
  return (
    <Suspense fallback={<CentralLoader />}>
      <Routes>
        <Route path={routes.HOME} element={<HomePage />} />
        <Route
          path={routes.DASHBOARD}
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={routes.PROFILE}
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path={routes.ACCOUNT}
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        />
        <Route path={routes.AUTH} element={<AuthPage />} />
        <Route path={routes.SIGNIN} element={<AuthPage />} />
        <Route path={routes.SIGNUP} element={<AuthPage />} />
        <Route path={routes.FORGOT_PASSWORD} element={<AuthPage />} />
        <Route path={routes.OTP} element={<AuthPage />} />
        <Route path={routes.CHANGE_PASSWORD} element={<AuthPage />} />

        <Route
          path={routes.TEMPLATES}
          element={<DashboardPage initialTab="Templates" />}
        />

        <Route path={routes.FEATURES} element={<FeaturesPage />} />

        <Route path={routes.ABOUT_US} element={<AboutUsPage />} />

        <Route path={routes.RESUME} element={<ResumeStudioPage />} />

        <Route path="*" element={<Page404 />} />
      </Routes>
    </Suspense>
  );
}

export default MainRoutes;
