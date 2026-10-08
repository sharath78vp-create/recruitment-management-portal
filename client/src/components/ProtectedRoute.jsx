import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  // User is not logged in
  if (!token || !storedUser) {
    return <Navigate to="/login" replace />;
  }

  let user;

  try {
    user = JSON.parse(storedUser);
  } catch (error) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return <Navigate to="/login" replace />;
  }

  // User has the wrong role
  if (role && user.role !== role) {
    if (user.role === "recruiter") {
      return <Navigate to="/recruiter-dashboard" replace />;
    }

    if (user.role === "candidate") {
      return <Navigate to="/candidate-dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;