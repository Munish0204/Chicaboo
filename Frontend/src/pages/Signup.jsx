import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character."
      );
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed");
        setLoading(false);
        return;
      }

      setLoading(false);
      // Redirect to login after successful signup
      navigate("/login");
    } catch (err) {
      setError("Network error, please try again later.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div
        className="group p-8 rounded-xl cursor-pointer max-w-md w-full
                   transition-transform transition-shadow duration-300 ease-in-out
                   hover:shadow-2xl hover:scale-[1.03]"
      >
        <form
          onSubmit={handleSignup}
          className="bg-white rounded-lg shadow-xl p-10
                     transition-colors duration-300
                     group-hover:bg-black
                     group-hover:text-white"
        >
          <h2
            className="text-4xl font-extrabold text-center text-gray-900 mb-8
                       group-hover:text-white"
          >
            Sign Up
          </h2>

          {error && (
            <p className="mb-6 text-center text-red-600 font-semibold group-hover:text-red-400">
              {error}
            </p>
          )}

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full mb-5 px-5 py-4 border border-gray-300 rounded-lg text-lg placeholder-gray-400
                       focus:outline-none focus:ring-3 focus:ring-indigo-500 transition
                       group-hover:bg-gray-800 group-hover:border-gray-600 group-hover:text-white
                       group-hover:placeholder-gray-400"
            disabled={loading}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full mb-5 px-5 py-4 border border-gray-300 rounded-lg text-lg placeholder-gray-400
                       focus:outline-none focus:ring-3 focus:ring-indigo-500 transition
                       group-hover:bg-gray-800 group-hover:border-gray-600 group-hover:text-white
                       group-hover:placeholder-gray-400"
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full mb-5 px-5 py-4 border border-gray-300 rounded-lg text-lg placeholder-gray-400
                       focus:outline-none focus:ring-3 focus:ring-indigo-500 transition
                       group-hover:bg-gray-800 group-hover:border-gray-600 group-hover:text-white
                       group-hover:placeholder-gray-400"
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full mb-8 px-5 py-4 border border-gray-300 rounded-lg text-lg placeholder-gray-400
                       focus:outline-none focus:ring-3 focus:ring-indigo-500 transition
                       group-hover:bg-gray-800 group-hover:border-gray-600 group-hover:text-white
                       group-hover:placeholder-gray-400"
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-lg font-semibold text-lg transition-colors
                       ${loading
                         ? "bg-gray-400 cursor-not-allowed text-gray-700"
                         : "bg-indigo-600 text-white hover:bg-indigo-700 group-hover:bg-indigo-400 group-hover:text-black"
                       }`}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>

          <p className="mt-6 text-center text-gray-700 group-hover:text-gray-300">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-indigo-600 font-semibold cursor-pointer hover:text-indigo-800 transition
                         group-hover:text-indigo-400"
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
