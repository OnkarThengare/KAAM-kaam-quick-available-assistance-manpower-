import { Navigate, Outlet, useLocation } from "react-router-dom";

function parseUser() {
  try {
    const raw = localStorage.getItem("kaam_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function RequireRole({ role }) {
  const token = localStorage.getItem("kaam_token");
  const user = parseUser();
  const loc = useLocation();

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: loc }} replace />;
  }
  if (role && user.role !== role) {
    return (
      <Navigate
        to={user.role === "worker" ? "/worker/dashboard" : "/client/dashboard"}
        replace
      />
    );
  }
  return <Outlet />;
}
