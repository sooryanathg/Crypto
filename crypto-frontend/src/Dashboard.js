import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaWallet, FaExchangeAlt, FaCog } from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");
  const username = localStorage.getItem("username");
  const [isProfileHovered, setIsProfileHovered] = useState(false);

  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }
  }, [navigate, userId]);

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    window.location.href = "/login";
  };

  const navVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  const profileVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.9, ease: [0.6, 0.05, 0.01, 0.9] } }, // Modified ease
    hover: { scale: 1.05, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)", transition: { duration: 0.3 } },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.3, ease: "easeInOut" } }, // Modified ease
    hover: { scale: 1.03, boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)", transition: { duration: 0.3 } },
    tap: { scale: 0.98 },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 text-gray-800 flex flex-col items-center p-10 relative overflow-hidden"
    >
      <motion.div
        initial={{ x: -200, y: 100, rotate: 45, opacity: 0 }}
        animate={{ x: "100vw", y: "50vh", rotate: 360, opacity: 0.2, transition: { duration: 10, repeat: Infinity, ease: "linear" } }}
        className="absolute w-40 h-40 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full blur-2xl"
      />
      <motion.div
        initial={{ x: "100vw", y: "80vh", rotate: -45, opacity: 0 }}
        animate={{ x: -100, y: "20vh", rotate: -360, opacity: 0.2, transition: { duration: 12, repeat: Infinity, ease: "linear" } }}
        className="absolute w-32 h-32 bg-gradient-to-r from-pink-300 to-indigo-300 rounded-full blur-2xl"
      />

      <motion.nav
        variants={navVariants}
        initial="hidden"
        animate="visible"
        className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg w-full p-6 flex justify-between items-center rounded-2xl shadow-2xl border border-gray-200"
      >
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

      <motion.div
        variants={profileVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        onMouseEnter={() => setIsProfileHovered(true)}
        onMouseLeave={() => setIsProfileHovered(false)}
        className="mt-16 bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg p-10 rounded-3xl shadow-2xl border border-gray-200 max-w-md w-full flex items-center space-x-8 relative"
      >
        <div className="relative">
          <img
            src="https://via.placeholder.com/120"
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-indigo-400 object-cover"
          />
          <AnimatePresence>
            {isProfileHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 rounded-full bg-indigo-500 bg-opacity-20 backdrop-filter backdrop-blur-lg flex items-center justify-center"
              >
                <FaCog className="text-indigo-700 text-3xl animate-spin" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div>
          <h3 className="text-3xl font-semibold text-indigo-700 mb-2">{username || "User"}</h3>
          <p className="text-gray-600 text-sm">User ID: {userId || "N/A"}</p>
        </div>
      </motion.div>

      <div className="mt-20 flex flex-col space-y-8 w-full max-w-md">
        <motion.button
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          whileTap="tap"
          onClick={() => navigate("/wallet")}
          className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold py-5 px-10 rounded-2xl shadow-xl flex items-center justify-center space-x-3"
        >
          <FaWallet /> <span>View Wallets</span>
        </motion.button>
        <motion.button
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          whileTap="tap"
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