import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { routes } from "../routes/routes";
import { getValidToken } from "../util/auth";

const ProtectedRoute = ({ children }) => {
  const token = getValidToken();
      const location = useLocation();

  if (!token) {
    const redirectUrl = encodeURIComponent(location.pathname+location.search);
    return <Navigate to={`${routes.SIGNIN}?redirect=${redirectUrl}`} replace />;
  }

  return children;
};


export default ProtectedRoute;

