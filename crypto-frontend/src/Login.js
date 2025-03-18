import { useState, useEffect, useRef } from "react";
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
  const navigate = useNavigate();

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
      const response = await axios.post("http://sql206.infinityfree.com/login.php", formData);
      
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
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        className="relative bg-opacity-90 bg-white p-12 rounded-3xl shadow-2xl w-[450px] border border-gray-300 backdrop-blur-md overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-300 to-purple-400 opacity-25 blur-3xl animate-pulse"></div>
        <h2 className="text-5xl font-extrabold text-gray-900 text-center drop-shadow-lg mb-8 animate-pulse">Welcome Back</h2>
        
        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
          <motion.div className="relative" whileFocus={{ scale: 1.05 }}>
            <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-700 opacity-80 animate-bounce" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-4 pl-12 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-purple-500 transition-all animate-glow"
              onChange={handleChange}
              required
            />
          </motion.div>
          <div className="relative">
            <motion.div className="relative" whileFocus={{ scale: 1.05 }}>
              <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-700 opacity-80 animate-spin-slow" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="w-full p-4 pl-12 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-purple-500 transition-all animate-glow"
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-gray-800 animate-pulse"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </motion.div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "#9333ea" }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-lg flex justify-center items-center shadow-lg transition-all text-lg tracking-wider uppercase animate-bounce"
            disabled={loading}
          >
            {loading ? "🔄 Logging in..." : "🔓 Login"}
          </motion.button>
        </form>

        {message && <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-4 text-purple-700 text-lg font-medium animate-glow"
        >{message}</motion.p>}

        <p className="text-gray-700 mt-4 text-center relative z-10 text-lg animate-pulse">
          Don't have an account? {" "}
          <a href="/signup" className="text-purple-600 hover:underline font-semibold">
            Sign Up
          </a>
        </p>

        <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-300 opacity-40 rounded-full blur-2xl animate-float"></div>
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-indigo-300 opacity-30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-5 right-5 text-xs text-gray-500 opacity-70 animate-pulse">© 2025 Crypto App</div>
        <div className="absolute top-2 left-2 text-xs text-gray-500 opacity-70 italic animate-spin-slow">Your security matters. 🔒</div>
      </motion.div>
    </div>
  );
};

export default Login;
