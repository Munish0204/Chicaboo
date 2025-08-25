import React, { useState, useEffect } from "react";
import { ShoppingCart, User, Menu, X, Search, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [location, setLocation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(() => {
    return { name: "Karthi", avatar: "K" }; // Demo user
  });

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    setUser(null);
    console.log("User logged out");
  };

  const navLinks = [
    { name: "Home", path: "/home" },
    { name: "Kids", path: "/kids" },
    { name: "Men", path: "/men" },
    { name: "Women", path: "/women" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-lg shadow-xl border-b border-gray-200/20"
            : "bg-white shadow-md"
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo + Location + Search */}
            <div className="flex items-center space-x-6">
              {/* Logo */}
              <Link to="/" className="relative group">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent transform transition-all duration-300 hover:scale-110 cursor-pointer">
                  Chic-A-Boo
                </div>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-500"></div>
                <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Star className="w-4 h-4 text-yellow-400 animate-pulse" />
                </div>
              </Link>

              {/* Desktop Location & Search */}
              <div className="hidden lg:flex items-center space-x-4">
                {/* Location Selector */}
                <div className="relative group">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500 group-hover:text-purple-600 transition-colors duration-300" />
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="appearance-none bg-transparent border-2 border-gray-200 hover:border-purple-400 rounded-xl px-4 py-2 text-sm text-gray-700 focus:outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all duration-300 cursor-pointer hover:shadow-lg"
                    >
                      <option value="">Select Location</option>
                      <option value="chennai">Chennai</option>
                      <option value="mumbai">Mumbai</option>
                      <option value="coimbatore">Coimbatore</option>
                    </select>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative group">
                  <div className="flex items-center">
                    <Search className="absolute left-3 w-4 h-4 text-gray-400 group-focus-within:text-purple-600 transition-colors duration-300 z-10" />
                    <input
                      type="text"
                      placeholder="Search amazing products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-64 pl-10 pr-4 py-2 border-2 border-gray-200 hover:border-purple-400 focus:border-purple-600 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all duration-300 hover:shadow-lg placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <ul className="hidden md:flex space-x-8 font-medium">
              {navLinks.map((link, index) => (
                <li key={link.name} className="relative group">
                  <Link
                    to={link.path}
                    className="relative px-4 py-2 text-gray-700 hover:text-purple-600 transition-all duration-300 cursor-pointer transform hover:scale-110 hover:-translate-y-1"
                  >
                    {link.name}
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-500"></div>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Right Side Icons */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Cart */}
              <Link to="/cart" className="relative group cursor-pointer">
                <div className="p-2 rounded-xl hover:bg-purple-50 transition-all duration-300 transform hover:scale-110 hover:rotate-12">
                  <ShoppingCart className="w-6 h-6 text-gray-600 group-hover:text-purple-600 transition-colors duration-300" />
                </div>
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-xs text-white font-bold animate-pulse">
                  3
                </div>
              </Link>

              {user ? (
                <>
                  {/* Profile Dropdown */}
                  <div className="relative group">
                    <div className="flex items-center space-x-3 p-2 rounded-xl hover:bg-purple-50 transition-all duration-300 cursor-pointer transform hover:scale-105">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {user.avatar}
                      </div>
                      <User className="w-5 h-5 text-gray-600 group-hover:text-purple-600" />
                    </div>

                    {/* Dropdown */}
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform scale-95 group-hover:scale-100">
                      <div className="p-2">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-800">
                            {user.name}
                          </p>
                        </div>
                        <div className="py-2">
                          <Link
                            to="/profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg"
                          >
                            Profile Settings
                          </Link>
                          <Link
                            to="/orders"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg"
                          >
                            Order History
                          </Link>
                          <hr className="my-2" />
                          <div
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                          >
                            Sign Out
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Orders link */}
                  <Link
                    to="/orders"
                    className="relative group px-4 py-2 text-sm text-purple-600 hover:text-purple-800 font-medium cursor-pointer transition-all duration-300 transform hover:scale-105"
                  >
                    Orders
                  </Link>
                </>
              ) : (
                <div className="flex space-x-4">
                  <Link
                    to="/signin"
                    className="px-6 py-2 text-sm font-medium text-purple-600 hover:text-purple-800 transition-all duration-300"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-xl hover:bg-purple-50 transition-all duration-300"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-20"></div>
    </>
  );
};

export default Navbar;
