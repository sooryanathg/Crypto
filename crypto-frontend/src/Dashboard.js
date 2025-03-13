import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");
  const username = localStorage.getItem("username");

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

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center p-6">
      {/* 🔹 Navigation Bar */}
      <nav className="bg-yellow-400 w-full p-4 flex justify-between items-center rounded-lg shadow-md">
        <h1 className="text-2xl font-extrabold text-gray-900">🚀 CryptoX Exchange</h1>
        <button 
          onClick={handleLogout} 
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg shadow-md text-white transition-all"
        >
          Logout
        </button>
      </nav>

      {/* 🔹 Profile Card */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow-md border border-yellow-300 max-w-md w-full flex items-center space-x-4">
        <img
          src="https://via.placeholder.com/80" 
          alt="Profile"
          className="w-16 h-16 rounded-full border border-yellow-500"
        />
        <div>
          <h3 className="text-xl font-bold text-yellow-500">{username || "User"}</h3>
          <p className="text-gray-600 text-sm">User ID: {userId || "N/A"}</p>
        </div>
      </div>

      {/* 🔹 Quick Access Buttons */}
      <div className="mt-12 flex flex-col space-y-4">
        <button 
          onClick={() => navigate("/wallet")} 
          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 px-6 rounded-lg shadow-md transition-all transform hover:scale-105"
        >
          View Wallets
        </button>
        <button 
          onClick={() => navigate("/transactions")} 
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all transform hover:scale-105"
        >
          Transactions
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
