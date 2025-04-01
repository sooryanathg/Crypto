import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock } from "react-icons/fa";
import Confetti from "react-confetti";

const Login = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  const navigate = useNavigate();

  // Update window size for Confetti
  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.title = "Login - Crypto App";
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/login.php`, formData);

      if (response.data.status === "success") {
        localStorage.setItem("user_id", response.data.user_id);
        localStorage.setItem("username", response.data.username);
        setIsAuthenticated(true);
        setMessage(`✅ Welcome, ${response.data.username}! Redirecting...`);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setMessage(`❌ ${response.data.message}`);
      }
    } catch (error) {
      setMessage("❌ Error logging in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 via-indigo-200 to-blue-300 overflow-hidden relative">
      {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} />}
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        className="relative bg-opacity-90 bg-white p-12 rounded-3xl shadow-2xl w-[450px] border border-gray-300 backdrop-blur-md overflow-hidden"
      >
        <h2 className="text-5xl font-extrabold text-gray-900 text-center drop-shadow-lg mb-8">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
          <div className="relative">
            <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-700 opacity-80" />
            <motion.input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-4 pl-12 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-purple-500 transition-all"
              onChange={handleChange}
              required
              whileFocus={{ scale: 1.05 }}
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-700 opacity-80" />
            <motion.input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="w-full p-4 pl-12 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-purple-500 transition-all"
              onChange={handleChange}
              required
              whileFocus={{ scale: 1.05 }}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-gray-800"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "#9333ea" }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-lg flex justify-center items-center shadow-lg transition-all text-lg tracking-wider uppercase"
            disabled={loading}
          >
            {loading ? "🔄 Logging in..." : "🔓 Login"}
          </motion.button>
        </form>

        {message && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-4 text-purple-700 text-lg font-medium"
          >
            {message}
          </motion.p>
        )}

        <p className="text-gray-700 mt-4 text-center text-lg">
          Don't have an account? {" "}
          <a href="/signup" className="text-purple-600 hover:underline font-semibold">
            Sign Up
          </a>
        </p>

        <div className="absolute bottom-5 right-5 text-xs text-gray-500 opacity-70">© 2025 Crypto App</div>
      </motion.div>
    </div>
  );
};

export default Login;
