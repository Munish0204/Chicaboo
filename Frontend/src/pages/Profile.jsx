import React from "react";

const Profile = () => {
  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem("user")) || {
    username: "Karthi",
    email: "karthi@example.com",
    phone: "+91 98765 43210",
    address: "123, MG Road, Chennai, India",
    joined: "2023-06-15",
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Hello, {user.username}!</h1>
      <p className="text-gray-600 mb-6">Welcome to your profile page. Here’s a quick overview of your account.</p>

      {/* User Info Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Account Information</h2>
        <div className="space-y-2 text-gray-700">
          <p><span className="font-medium">Username:</span> {user.username}</p>
          <p><span className="font-medium">Email:</span> {user.email}</p>
          <p><span className="font-medium">Phone:</span> {user.phone}</p>
          <p><span className="font-medium">Address:</span> {user.address}</p>
          <p><span className="font-medium">Member Since:</span> {user.joined}</p>
        </div>
      </div>

      {/* Orders Summary */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        <ul className="divide-y divide-gray-200">
          <li className="py-2 flex justify-between">
            <span>Chic Summer T-Shirt</span>
            <span className="text-gray-500">Delivered</span>
          </li>
          <li className="py-2 flex justify-between">
            <span>Kids Cartoon Shorts</span>
            <span className="text-gray-500">Shipped</span>
          </li>
          <li className="py-2 flex justify-between">
            <span>Men’s Denim Jacket</span>
            <span className="text-gray-500">Processing</span>
          </li>
        </ul>
      </div>

      {/* Profile Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Actions</h2>
        <div className="flex flex-col space-y-3">
          <button className="px-6 py-2 text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-all duration-300">
            Edit Profile
          </button>
          <button className="px-6 py-2 text-purple-600 border-2 border-purple-600 rounded-xl hover:bg-purple-50 transition-all duration-300">
            Change Password
          </button>
          <button className="px-6 py-2 text-red-600 border-2 border-red-600 rounded-xl hover:bg-red-50 transition-all duration-300">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
