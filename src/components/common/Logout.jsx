import { useEffect } from "react";

const Logout = () => {
  useEffect(() => {
    // Clear all authentication data safely
    localStorage.clear();
    sessionStorage.clear();
    // Redirect entirely to reset any stored context/states
    window.location.href = "/login";
  }, []);

  return null;
};

export default Logout;
