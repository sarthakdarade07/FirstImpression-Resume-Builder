import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { routes } from "../routes/routes";

const ProtectedRoute = ({ children }) => {
  const token =
    useSelector((state) => state.auth.token) ||
    localStorage.getItem("jwtToken");

  if (!token) {
    return <Navigate to={routes.SIGNIN} replace />;
  }

  return children;
};


export default ProtectedRoute;

