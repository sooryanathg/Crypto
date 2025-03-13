import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-3xl font-bold text-white text-center">Sign Up</h2>
        
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg flex justify-center items-center"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {message && <p className="text-center mt-4 text-gray-300">{message}</p>}

        <p className="text-gray-400 mt-4 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
