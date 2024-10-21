import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../libs/context/auth-context";

export default function PrivateOutlet() {
  const { authenticated } = useAuth();

  return authenticated ? (
    <div className="font-inter">
      <Outlet />
    </div>
  ) : (
    <Navigate to="/" />
  );
}
