import React from "react";
import { Outlet, NavLink } from "react-router-dom";

const menuItems = [
  { path: "shoes", label: "Shoes" },
  { path: "watches", label: "Watches" },
  { path: "pant", label: "Pant" },
  { path: "traditional", label: "Traditional" },
  { path: "shirt", label: "Shirt" },
  { path: "t-shirts", label: "T-Shirts" },
  { path: "shorts", label: "Shorts" },
  { path: "tracks", label: "Tracks" },
];

const MenLayout = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-center mb-8">Men's Collection</h1>

      <nav className="sticky top-0 z-10 bg-white shadow-md rounded-lg p-4 flex flex-wrap justify-center gap-4">
        {menuItems.map(({ path, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `px-4 py-2 text-sm rounded-md font-medium transition-all duration-200 ${
                isActive
                  ? "bg-black text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-8">
        <Outlet />
      </div>
    </div>
  );
};

export default MenLayout;
