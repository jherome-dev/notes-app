import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const user = queryParams.get("user");

    if (token && user) {
      // Store the user data and token in local storage
      localStorage.setItem("token", token);

      // Redirect to the dashboard
      console.log("Redirecting to dashboard..."); // This should show up
      navigate("/dashboard");
    } else {
      console.error("No token or user data received");
      navigate("/login");
    }
  }, [location.search, navigate]);

  return <div>Loading...</div>;
};

export default GoogleCallback;
