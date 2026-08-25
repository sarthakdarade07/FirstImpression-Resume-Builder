import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import ProtectedRoute from "../contexts/ProtectedRoutes";
import DashboardPage from "../pages/DashboardPage";
import ProfilePage from "../pages/ProfilePage";
import AccountPage from "../pages/AccountPage";
import AuthPage from "../pages/AuthPage";
import { useSelector } from "react-redux";
import { routes } from "./routes";

function MainRoutes() {
  const isAuthenticated =
    useSelector((state) => state.auth.user) || localStorage.getItem("jwtToken");

  return (
    <Routes>
      <Route
        path={routes.HOME}
        element={
          isAuthenticated ? (
            <Navigate to={routes.DASHBOARD} replace />
          ) : (
            <HomePage />
          )
        }
      />
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
        element={
          <div className="text-center py-20 text-gray-500 font-medium">
            Features tab is under development
          </div>
        }
      />
    </Routes>
  );
}

export default MainRoutes;

