import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function OAuth2Success() {

  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {

    const token = params.get("token");
    const username = params.get("username");

    if (!token) {
      navigate("/login");
      return;
    }

    // Clear old user data first
    localStorage.clear();

    // Store fresh data
    localStorage.setItem("token", token);

    if (username) {
      localStorage.setItem("username", username);
    }

    navigate("/UserProfile");

  }, [navigate]);

  return <h3 className="text-center mt-5">Logging you in...</h3>;
}

export default OAuth2Success;
