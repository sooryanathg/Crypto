import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaCheckCircle, FaTimesCircle, FaSyncAlt } from "react-icons/fa";

const Transactions = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState("Loading transactions...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setMessage("❌ No user found. Please log in.");
      setLoading(false);
      return;
    }
    fetchTransactions();
  }, [userId]);

  const fetchTransactions = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const transactionVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.6, 0.05, -0.01, 0.9] } },
    hover: { scale: 1.03, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)", transition: { duration: 0.3 } },
  };

  const loadingVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8 flex flex-col items-center"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/dashboard")}
        className="bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 transition-transform px-6 py-2 rounded-xl shadow-xl mb-6 text-lg font-semibold tracking-wide flex items-center space-x-2"
      >
        <FaArrowLeft /> <span>Back to Dashboard</span>
      </motion.button>

      <h2 className="text-5xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-red-400 to-pink-400 drop-shadow-md tracking-wide animate-pulseSlow mb-8">
        Transaction History
      </h2>

      <AnimatePresence>
        {loading && (
          <motion.div
            variants={loadingVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="flex items-center space-x-3 text-gray-400 mb-4"
          >
            <FaSyncAlt className="animate-spin text-2xl" />
            <span>Loading transactions...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {message && <p className="text-center mt-4 text-gray-400">{message}</p>}

      {transactions.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delayChildren: 0.2, staggerChildren: 0.1 }}
          className="mt-8 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {transactions.map((tx) => (
            <motion.div
              key={tx.transaction_id}
              variants={transactionVariants}
              whileHover="hover"
              className="relative bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden group"
            >
              <div
                className={`absolute inset-0 rounded-2xl blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-300 ${
                  tx.transaction_type === "Send"
                    ? "bg-red-500"
                    : tx.transaction_type === "Receive"
                    ? "bg-green-500"
                    : "bg-yellow-500"
                }`}
              ></div>

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
                {tx.transaction_type === "Send" && <span>📤</span>}
                {tx.transaction_type === "Receive" && <span>📥-</span>}
                {tx.transaction_type}
              </div>

              <p className="text-2xl font-bold text-gray-100">{tx.currency_type} Transaction</p>
              <p
                className={`font-semibold mt-2 flex items-center gap-2 ${
                  tx.status === "Completed" ? "text-green-400" : "text-red-400"
                }`}
              >
                {tx.status === "Completed" ? <FaCheckCircle /> : <FaTimesCircle />}
                <span>Status: {tx.status}</span>
              </p>
              <p className="text-3xl font-extrabold text-yellow-300 mt-2">
                💰 {tx.amount} {tx.currency_type}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                <strong>Time:</strong> {tx.timestamp}
              </p>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Transactions;