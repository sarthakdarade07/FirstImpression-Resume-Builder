import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import ProtectedRoute from "../protectedPath/ProtectedRoutes";
import DashboardPage from "../pages/DashboardPage";
import ProfilePage from "../pages/ProfilePage";
import AccountPage from "../pages/AccountPage";
import AuthPage from "../pages/AuthPage";
import ResumeStudioPage from "../pages/ResumeStudioPage";
import FeaturesPage from "../pages/FeaturesPage";
import AboutUsPage from "../pages/AboutUsPage";
import { useSelector } from "react-redux";
import { routes } from "./routes";

function MainRoutes() {
  const isAuthenticated =
    useSelector((state) => state.auth.user) || localStorage.getItem("jwtToken");

  return (
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
      
    </Routes>
  );
}

export default MainRoutes;

