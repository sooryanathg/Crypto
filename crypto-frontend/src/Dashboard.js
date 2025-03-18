import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaWallet, FaExchangeAlt, FaCog } from "react-icons/fa";


const API_BASE_URL = "https://crypto-system.great-site.net/";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(localStorage.getItem("user_id"));
  const username = localStorage.getItem("username");

  // Flag to determine if logout has been initiated.
  const [loggingOut, setLoggingOut] = useState(false);
  const [isProfileHovered, setIsProfileHovered] = useState(false);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchCalled = useRef(false);

  // Redirect if no userId is found.
  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    if (fetchCalled.current) return;
    fetchCalled.current = true;

    const fetchUserDetails = async () => {
      try {
          const response = await fetch(`${API_BASE_URL}get_user.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.status === "success") {
          setBalance(data.user.balance);
        } else {
          console.error("Error fetching user:", data.message);
        }
      } catch (error) {
        console.error("Network or API error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();

    return () => {
      fetchCalled.current = false;
    };
  }, [userId, navigate]);

  const handleLogout = () => {
    // Set a flag to suppress exit animation during logout.
    setLoggingOut(true);
    // Clear storage immediately.
    localStorage.clear();
    // You can also clear any local state if needed.
    // A very short delay allows the flag to register before navigating.
    setTimeout(() => {
      setUserId(null);
      navigate("/login");
    }, 10);
  };

  // Optionally, if no userId is present, don't render any Dashboard UI.
  if (!userId) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      // If logging out, immediately remove (duration 0), otherwise use fade-out
      exit={
        loggingOut
          ? { opacity: 0, transition: { duration: 0 } }
          : { opacity: 0, transition: { duration: 0.15, ease: "easeInOut" } }
      }
      className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 text-gray-800 flex flex-col items-center p-10 relative overflow-hidden"
    >
      {/* Navbar */}
      <motion.nav className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg w-full p-6 flex justify-between items-center rounded-2xl shadow-2xl border border-gray-200">
        <h1 className="text-3xl font-semibold text-indigo-700 tracking-wide">
          <span className="text-indigo-500 animate-pulse">🚀</span> CryptoX
        </h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl shadow-md text-white font-medium transition-colors duration-300"
        >
          Logout
        </motion.button>
      </motion.nav>

      {/* Profile Card */}
      <motion.div className="mt-16 bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg p-10 rounded-3xl shadow-2xl border border-gray-200 max-w-md w-full flex items-center space-x-8 relative">
        <div
          className="relative"
          onMouseEnter={() => setIsProfileHovered(true)}
          onMouseLeave={() => setIsProfileHovered(false)}
        >
          <img
            src="https://via.placeholder.com/120" // Replace with an actual reliable image URL
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-indigo-400 object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "placeholder_image.png"; // Provide a local fallback image
            }}
          />

          {/* Spinning Gear Animation on Hover */}
          <AnimatePresence>
            {isProfileHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center justify-center bg-indigo-200 bg-opacity-40 rounded-full"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <FaCog className="text-indigo-700 text-3xl" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div>
          <h3 className="text-3xl font-semibold text-indigo-700 mb-2">
            {username || "User"}
          </h3>
          <p className="text-gray-600 text-sm">User ID: {userId || "N/A"}</p>
          <p className="text-gray-700 text-lg font-medium mt-2">
            Balance:{" "}
            <span className="text-green-600 font-bold">
              {loading ? "Loading..." : `$${parseFloat(balance).toFixed(2)}`}
            </span>
          </p>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="mt-20 flex flex-col space-y-8 w-full max-w-md">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/wallet")}
          className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold py-5 px-10 rounded-2xl shadow-xl flex items-center justify-center space-x-3"
        >
          <FaWallet /> <span>View Wallets</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/transactions")}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-5 px-10 rounded-2xl shadow-xl flex items-center justify-center space-x-3"
        >
          <FaExchangeAlt /> <span>Transactions</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Dashboard;
