import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import anime from "animejs";
import Confetti from "react-confetti"; // Install: npm install react-confetti

const Login = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);
  const loginFormRef = useRef(null);

  useEffect(() => {
    anime({
      targets: loginFormRef.current,
      translateY: [-50, 0],
      opacity: [0, 1],
      duration: 1000,
      easing: "easeOutQuad",
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("http://localhost/Crypto/login.php", formData);

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 relative">
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      <div
        ref={loginFormRef}
        className="bg-gray-800/50 backdrop-blur-md border border-gray-700 p-8 rounded-2xl shadow-2xl w-96"
      >
        <h2 className="text-3xl font-bold text-white text-center mb-6 animate-pulse">Login</h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 transition-colors duration-200 text-white font-semibold py-3 rounded-lg flex justify-center items-center animate-bounce"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {message && <p className="text-center mt-4 text-gray-300">{message}</p>}

        <p className="text-gray-400 mt-4 text-center">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-400 hover:underline animate-pulse">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;