import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Transactions = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState("Loading transactions...");

  useEffect(() => {
    if (!userId) {
      setMessage("❌ No user found. Please log in.");
      return;
    }
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.post(
        "http://localhost/Crypto/get_transactions.php",
        { user_id: userId }
      );

      if (response.data.status === "success" && response.data.transactions.length > 0) {
        setTransactions(response.data.transactions);
        setMessage("");
      } else {
        setMessage("No transactions found.");
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setMessage("❌ Error fetching transactions.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8 flex flex-col items-center">
      
      {/* Back Button */}
      <button 
        onClick={() => navigate("/dashboard")} 
        className="bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 hover:scale-105 transition-transform px-6 py-2 rounded-xl shadow-xl mb-6 text-lg font-semibold tracking-wide"
      >
        ⬅ Back to Dashboard
      </button>

      {/* Page Title */}
      <h2 className="text-5xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-red-400 to-pink-400 drop-shadow-md tracking-wide animate-pulseSlow">
        Transaction History
      </h2>

      {message && <p className="text-center mt-4 text-gray-400">{message}</p>}

      {/* Transaction List */}
      {transactions.length > 0 && (
        <div className="mt-8 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
          {transactions.map((tx) => (
            <div 
              key={tx.transaction_id} 
              className="relative bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 hover:scale-105 transition-transform duration-300 ease-in-out overflow-hidden group"
            >
              {/* Glowing Edge Overlay */}
              <div 
                className={`absolute inset-0 rounded-2xl blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-300 ${
                  tx.transaction_type === "Send"
                    ? "bg-red-500"
                    : tx.transaction_type === "Receive"
                      ? "bg-green-500"
                      : "bg-yellow-500"
                }`}
              ></div>

              {/* Enhanced Transaction Type Badge */}
              <div 
                className={`absolute top-4 right-4 px-4 py-2 flex items-center gap-2 rounded-full text-sm font-bold backdrop-blur-lg bg-opacity-60 shadow-lg animate-bounceSmooth hover:scale-110 transition-transform duration-200 ease-in-out
                  ${
                    tx.transaction_type === "Send"
                      ? "bg-red-600 text-white shadow-red-500/60"
                      : tx.transaction_type === "Receive"
                      ? "bg-green-600 text-white shadow-green-500/60"
                      : "bg-yellow-600 text-black shadow-yellow-500/60"
                  }`}
              >
                {/* Icons for Transaction Type */}
                {tx.transaction_type === "Send" && <span>📤</span>}
                {tx.transaction_type === "Receive" && <span>📥</span>}
                {tx.transaction_type}
              </div>

              {/* Transaction Details */}
              <p className="text-2xl font-bold text-gray-100">{tx.currency_type} Transaction</p>
              <p className={`font-semibold mt-2 ${tx.status === "Completed" ? "text-green-400" : "text-red-400"}`}>
                Status: {tx.status}
              </p>
              <p className="text-3xl font-extrabold text-yellow-300 mt-2">
                💰 {tx.amount} {tx.currency_type}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                <strong>Time:</strong> {tx.timestamp}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Transactions;
