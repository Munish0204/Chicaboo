import React from "react";

const LogoutButton = ({ onLogout }) => {
  const handleLogout = () => {
    // Remove user data from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    // Notify parent component (Navbar) about logout
    if (onLogout) onLogout();
  };

  return (
    <button
      onClick={handleLogout}
      className="text-gray-600 hover:text-black transition px-3 py-1 border border-gray-300 rounded-md"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
