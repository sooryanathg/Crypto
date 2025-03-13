import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaCheckCircle, FaTimesCircle, FaSyncAlt } from "react-icons/fa";
import { format } from "date-fns";

// Custom hook for data fetching
const useTransactions = (userId) => {
  const [state, setState] = useState({ 
    transactions: [], 
    isLoading: true, 
    error: null 
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "http://localhost/Crypto/get_transactions.php",
          { user_id: userId }
        );

        if (response.data.status === "success") {
          setState({
            transactions: response.data.transactions,
            isLoading: false,
            error: response.data.transactions.length ? null : "No transactions found."
          });
        } else {
          setState({ ...state, isLoading: false, error: "No transactions available." });
        }
      } catch (error) {
        setState({ 
          transactions: [], 
          isLoading: false, 
          error: "❌ Failed to load transactions. Please try again." 
        });
      }
    };

    userId ? fetchData() : setState({ ...state, isLoading: false, error: "❌ User not authenticated." });
  }, [userId]);

  return state;
};

// Reusable components
const LoadingSpinner = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex items-center space-x-3 text-gray-400 mb-4"
  >
    <FaSyncAlt className="animate-spin text-2xl" />
    <span>Loading transactions...</span>
  </motion.div>
);

const StatusPill = ({ type, children }) => {
  const typeStyles = {
    Send: "bg-red-600 text-white shadow-red-500/60",
    Receive: "bg-green-600 text-white shadow-green-500/60",
    default: "bg-yellow-600 text-black shadow-yellow-500/60"
  };

  return (
    <div className={`absolute top-4 right-4 px-4 py-2 flex items-center gap-2 rounded-full text-sm font-bold backdrop-blur-lg bg-opacity-60 shadow-lg animate-bounceSmooth ${typeStyles[type] || typeStyles.default}`}>
      {children}
    </div>
  );
};

const TransactionCard = ({ transaction }) => {
  const typeConfig = {
    Send: { emoji: "📤", color: "red-500" },
    Receive: { emoji: "📥", color: "green-500" },
    default: { emoji: "💰", color: "yellow-500" }
  };

  const { emoji, color } = typeConfig[transaction.transaction_type] || typeConfig.default;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 50, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.6, 0.05, -0.01, 0.9] } },
        hover: { scale: 1.03, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)", transition: { duration: 0.3 } }
      }}
      whileHover="hover"
      className="relative bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden group"
    >
      <div className={`absolute inset-0 rounded-2xl blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-300 bg-${color}`} />

      <StatusPill type={transaction.transaction_type}>
        {emoji} {transaction.transaction_type}
      </StatusPill>

      <p className="text-2xl font-bold text-gray-100">{transaction.currency_type} Transaction</p>
      <p className={`font-semibold mt-2 flex items-center gap-2 ${transaction.status === "Completed" ? "text-green-400" : "text-red-400"}`}>
        {transaction.status === "Completed" ? <FaCheckCircle /> : <FaTimesCircle />}
        <span>Status: {transaction.status}</span>
      </p>
      <p className="text-3xl font-extrabold text-yellow-300 mt-2">
        {emoji} {transaction.amount} {transaction.currency_type}
      </p>
      <p className="text-gray-400 text-sm mt-2">
        <strong>Time:</strong> {format(new Date(transaction.timestamp), 'PPpp')}
      </p>
    </motion.div>
  );
};

const Transactions = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");
  const { transactions, isLoading, error } = useTransactions(userId);

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
        {isLoading ? <LoadingSpinner /> : (
          <>
            {error && <p className="text-center mt-4 text-gray-400">{error}</p>}
            
            {transactions.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delayChildren: 0.2, staggerChildren: 0.1 }}
                className="mt-8 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {transactions.map((tx) => (
                  <TransactionCard key={tx.transaction_id} transaction={tx} />
                ))}
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Transactions;