import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

const Signup = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = "Sign Up - Crypto App";
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("http://localhost/Crypto/register.php", formData);
      
      if (response.data.status === "success") {
        setMessage("✅ Signup successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setMessage(`❌ ${response.data.message}`);
      }
    } catch (error) {
      setMessage("❌ Error signing up. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 via-blue-200 to-purple-300 overflow-hidden relative">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        className="relative bg-opacity-90 bg-white p-12 rounded-3xl shadow-2xl w-[450px] border border-gray-300 backdrop-blur-md overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-300 to-purple-400 opacity-25 blur-3xl animate-pulse"></div>
        <h2 className="text-5xl font-extrabold text-gray-800 text-center drop-shadow-lg mb-8 animate-pulse">Join Now</h2>
        
        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
          <motion.div className="relative" whileFocus={{ scale: 1.05 }}>
            <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 opacity-80 animate-spin-slow" />
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="w-full p-4 pl-12 rounded-lg bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-purple-500 transition-all animate-glow"
              onChange={handleChange}
              required
            />
          </motion.div>
          <motion.div className="relative" whileFocus={{ scale: 1.05 }}>
            <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 opacity-80 animate-bounce" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-4 pl-12 rounded-lg bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-purple-500 transition-all animate-glow"
              onChange={handleChange}
              required
            />
          </motion.div>
          <div className="relative">
            <motion.div className="relative" whileFocus={{ scale: 1.05 }}>
              <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 opacity-80 animate-spin-slow" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="w-full p-4 pl-12 rounded-lg bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-purple-500 transition-all animate-glow"
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
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 rounded-lg flex justify-center items-center shadow-lg transition-all text-lg tracking-wider uppercase animate-bounce"
            disabled={loading}
          >
            {loading ? "✨ Creating Account..." : "Sign Up"}
          </motion.button>
        </form>

        {message && <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-4 text-purple-600 text-lg font-medium animate-glow"
        >{message}</motion.p>}

        <p className="text-gray-700 mt-4 text-center relative z-10 text-lg animate-pulse">
          Already have an account? {" "}
          <a href="/login" className="text-purple-500 hover:underline font-semibold">
            Log In
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
