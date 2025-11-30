import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../contexts/AuthContext";

export default function Logout() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    function logoutUser() {
      if (!user) {
        navigate("/");
      }
      logout();
      navigate("/");
    }
    logoutUser();
  }, [navigate, user, logout]);

  return;
}
