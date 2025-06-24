import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const isAuthenticated = useSelector((state) => state.users.isAuthenticated);

  return token && isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
