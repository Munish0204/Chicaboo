import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Add this import

export default function Login() {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1 = login form, 2 = OTP form
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [timer, setTimer] = useState(30); // countdown timer for resend
  const [darkMode, setDarkMode] = useState(true); // UI enhancement only
  const navigate = useNavigate(); // Add this line

  // Handle countdown on OTP page - ORIGINAL CODE
  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Step 1: Request OTP - ORIGINAL CODE
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    try {
      const res = await fetch("http://localhost:8000/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, phone }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to request OTP");

      setInfo("OTP sent successfully");
      setStep(2);
      setTimer(30); // reset timer when OTP requested
    } catch (err) {
      setError(err.message || "Network error");
    }
  };

  // Step 2: Bypass OTP verification (any OTP works) - ORIGINAL CODE
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    try {
      const fakeUser = { username, phone };
      const fakeToken = "fake-jwt-token";

      // Note: In artifacts, we simulate localStorage
      console.log("Token:", fakeToken);
      console.log("User:", fakeUser);
      
      setInfo("Login successful! Redirecting...");
      setTimeout(() => {
        navigate("/home"); // Redirect to Home page
      }, 1000); // Wait 1 second before redirect
    } catch (err) {
      setError("Something went wrong");
    }
  };

  // Step 3: Resend OTP (only if timer expired) - ORIGINAL CODE
  const handleResendOtp = async () => {
    if (timer > 0) return; // block resend until timer ends

    setError("");
    setInfo("");

    try {
      const res = await fetch("http://localhost:8000/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to resend OTP");

      setInfo("New OTP sent successfully");
      setTimer(30); // restart timer
    } catch (err) {
      setError(err.message || "Network error");
    }
  };

  // UI enhancement only
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 relative transition-all duration-700 ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100'
    }`}>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-10 -left-10 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float ${
          darkMode ? 'bg-purple-400' : 'bg-purple-300'
        }`}></div>
        <div className={`absolute -bottom-10 -right-10 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-reverse ${
          darkMode ? 'bg-indigo-400' : 'bg-indigo-300'
        }`}></div>
        <div className={`absolute top-1/2 left-1/3 w-60 h-60 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse ${
          darkMode ? 'bg-pink-400' : 'bg-pink-300'
        }`}></div>
      </div>

      {/* Theme Toggle Button */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={toggleTheme}
          className={`relative w-16 h-8 rounded-full transition-all duration-500 focus:outline-none focus:ring-4 focus:ring-opacity-30 transform hover:scale-110 ${
            darkMode 
              ? 'bg-slate-700 focus:ring-purple-500' 
              : 'bg-gray-300 focus:ring-indigo-500'
          }`}
        >
          <div className={`absolute top-1 left-1 w-6 h-6 rounded-full transition-all duration-500 transform flex items-center justify-center shadow-lg ${
            darkMode 
              ? 'translate-x-8 bg-gradient-to-r from-purple-400 to-pink-400' 
              : 'translate-x-0 bg-gradient-to-r from-yellow-400 to-orange-400'
          }`}>
            {darkMode ? (
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            ) : (
              <svg className="w-3 h-3 text-yellow-800" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </button>
      </div>

      <div className={`w-full max-w-md backdrop-blur-xl rounded-3xl p-8 shadow-2xl border transition-all duration-700 transform hover:scale-105 ${
        darkMode 
          ? 'bg-white/5 border-white/10 shadow-purple-900/25' 
          : 'bg-white/30 border-white/20 shadow-indigo-900/25'
      } ${step === 2 ? 'animate-slide-up' : 'animate-fade-in'}`}>
        
        {/* Header with Icon */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 shadow-xl transform transition-all duration-500 hover:rotate-12 hover:scale-110 ${
            darkMode 
              ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500' 
              : 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500'
          }`}>
            {step === 1 ? (
              <svg className="w-10 h-10 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            ) : (
              <svg className="w-10 h-10 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            )}
          </div>
          
          <h2 className={`text-3xl font-bold mb-3 bg-gradient-to-r bg-clip-text text-transparent transition-all duration-500 ${
            darkMode 
              ? 'from-white via-purple-200 to-pink-200' 
              : 'from-gray-800 via-indigo-600 to-purple-600'
          }`}>
            {step === 1 ? "Login with Phone" : "Enter OTP"}
          </h2>
          
          <p className={`text-sm transition-colors duration-500 ${
            darkMode ? 'text-white/60' : 'text-gray-600'
          }`}>
            {step === 1 ? "Enter your details to continue" : "Check your phone for the verification code"}
          </p>
        </div>

        {/* Step 1: Request OTP - ORIGINAL FUNCTIONALITY */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-4">
              {/* Username Input */}
              <div className="relative group">
                <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-300 ${
                  darkMode ? 'text-purple-400' : 'text-indigo-500'
                }`}>
                  <svg className="w-5 h-5 group-focus-within:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Enter Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className={`w-full pl-10 pr-4 py-4 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:scale-105 ${
                    darkMode 
                      ? 'bg-white/5 border border-white/10 text-white placeholder-white/40 focus:bg-white/10 focus:border-purple-500/50 focus:ring-purple-500/20 hover:bg-white/8' 
                      : 'bg-white/40 border border-white/30 text-gray-800 placeholder-gray-500 focus:bg-white/60 focus:border-indigo-500/50 focus:ring-indigo-500/20 hover:bg-white/50'
                  }`}
                />
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
                  darkMode 
                    ? 'bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-indigo-500/5' 
                    : 'bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5'
                }`}></div>
              </div>

              {/* Phone Input */}
              <div className="relative group">
                <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-300 ${
                  darkMode ? 'text-purple-400' : 'text-indigo-500'
                }`}>
                  <svg className="w-5 h-5 group-focus-within:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Enter Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className={`w-full pl-10 pr-4 py-4 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:scale-105 ${
                    darkMode 
                      ? 'bg-white/5 border border-white/10 text-white placeholder-white/40 focus:bg-white/10 focus:border-purple-500/50 focus:ring-purple-500/20 hover:bg-white/8' 
                      : 'bg-white/40 border border-white/30 text-gray-800 placeholder-gray-500 focus:bg-white/60 focus:border-indigo-500/50 focus:ring-indigo-500/20 hover:bg-white/50'
                  }`}
                />
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
                  darkMode 
                    ? 'bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-indigo-500/5' 
                    : 'bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5'
                }`}></div>
              </div>
            </div>

            <button
              onClick={handleLogin}
              className={`relative w-full py-4 rounded-2xl font-bold text-lg shadow-2xl transition-all duration-500 transform hover:scale-105 hover:shadow-3xl active:scale-95 focus:outline-none focus:ring-4 overflow-hidden ${
                darkMode 
                  ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white hover:from-purple-500 hover:via-pink-500 hover:to-indigo-500 focus:ring-purple-500/30' 
                  : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 focus:ring-indigo-500/30'
              }`}
            >
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send OTP
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000"></div>
            </button>
          </div>
        )}

        {/* Step 2: Verify OTP (with timer) - ORIGINAL FUNCTIONALITY */}
        {step === 2 && (
          <div className="space-y-6 animate-slide-up">
            <div className="relative group">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className={`w-full px-4 py-6 text-center text-2xl font-mono tracking-widest rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:scale-105 ${
                  darkMode 
                    ? 'bg-white/5 border border-white/10 text-white placeholder-white/30 focus:bg-white/10 focus:border-green-500/50 focus:ring-green-500/20 hover:bg-white/8' 
                    : 'bg-white/40 border border-white/30 text-gray-800 placeholder-gray-400 focus:bg-white/60 focus:border-green-500/50 focus:ring-green-500/20 hover:bg-white/50'
                }`}
              />
              <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
                darkMode 
                  ? 'bg-gradient-to-r from-green-500/5 via-emerald-500/5 to-teal-500/5' 
                  : 'bg-gradient-to-r from-green-500/5 via-emerald-500/5 to-teal-500/5'
              }`}></div>
            </div>
            
            <button
              onClick={handleVerifyOtp}
              className="relative w-full py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-2xl hover:from-green-500 hover:to-emerald-500 focus:outline-none focus:ring-4 focus:ring-green-500/30 transition-all duration-500 transform hover:scale-105 hover:shadow-3xl active:scale-95 overflow-hidden"
            >
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Login
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000"></div>
            </button>

            <button
              onClick={handleResendOtp}
              disabled={timer > 0}
              className={`relative w-full py-4 rounded-2xl font-semibold transition-all duration-500 transform hover:scale-105 active:scale-95 overflow-hidden ${
                timer > 0
                  ? darkMode 
                    ? "bg-white/5 text-white/40 cursor-not-allowed border border-white/10" 
                    : "bg-white/20 text-gray-400 cursor-not-allowed border border-white/20"
                  : darkMode
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/30"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/30"
              }`}
            >
              {timer > 0 ? (
                <span className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  <span>Resend OTP in {timer}s</span>
                </span>
              ) : (
                <>
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Resend OTP
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000"></div>
                </>
              )}
            </button>

            {/* Back to Step 1 */}
            <button
              onClick={() => setStep(1)}
              className={`w-full text-center py-3 transition-all duration-300 hover:scale-105 ${
                darkMode ? 'text-white/60 hover:text-white' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <span className="flex items-center justify-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to login</span>
              </span>
            </button>
          </div>
        )}

        {/* Error / Info messages - ORIGINAL FUNCTIONALITY */}
        {error && (
          <div className="mt-6 p-4 bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-2xl animate-shake">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-red-300 text-center text-sm font-medium">{error}</p>
            </div>
          </div>
        )}
        
        {info && (
          <div className="mt-6 p-4 bg-green-500/10 backdrop-blur-sm border border-green-500/20 rounded-2xl animate-bounce-in">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-400 mr-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-green-300 text-center text-sm font-medium">{info}</p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-30px) rotate(5deg); }
          66% { transform: translateY(-15px) rotate(-5deg); }
        }

        @keyframes float-reverse {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(30px) rotate(-5deg); }
          66% { transform: translateY(15px) rotate(5deg); }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
          20%, 40%, 60%, 80% { transform: translateX(8px); }
        }

        @keyframes bounce-in {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-float-reverse {
          animation: float-reverse 8s ease-in-out infinite;
          animation-delay: 2s;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-shake {
          animation: shake 0.6s ease-in-out;
        }

        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out;
        }

        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
}