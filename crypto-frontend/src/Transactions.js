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
    error: null,
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
            error: response.data.transactions.length
              ? null
              : "No transactions found.",
          });
        } else {
          setState({
            ...state,
            isLoading: false,
            error: "No transactions available.",
          });
        }
      } catch (error) {
        setState({
          transactions: [],
          isLoading: false,
          error: "❌ Failed to load transactions. Please try again.",
        });
      }
    };

    userId
      ? fetchData()
      : setState({ ...state, isLoading: false, error: "❌ User not authenticated." });
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
    <FaSyncAlt className="animate-spin text-3xl" />
    <span>Loading transactions...</span>
  </motion.div>
);

const TransactionCard = ({ transaction }) => {
  const typeConfig = {
    Send: { icon: "📤", bgColor: "bg-red-200", textColor: "text-red-800" },
    Receive: { icon: "📥", bgColor: "bg-green-200", textColor: "text-green-800" },
    default: { icon: "💰", bgColor: "bg-yellow-200", textColor: "text-yellow-800" },
  };

  const { icon, bgColor, textColor } =
    typeConfig[transaction.transaction_type] || typeConfig.default;

  return (
    <motion.div
      whileHover={{ scale: 1.05, rotateY: 10 }}
      className={`relative p-6 rounded-lg shadow-lg transition-transform duration-300 ${bgColor} border border-gray-300`}
    >
      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-bold ${textColor}`}>
        {icon} {transaction.transaction_type}
      </div>

      <div className="text-gray-800 space-y-2">
        <p className="text-xl font-semibold">{transaction.currency_type} Transaction</p>
        <p className={`font-medium flex items-center gap-2 ${transaction.status === "Completed" ||"completed" ? "text-green-600" : "text-red-600"}`}>
          {transaction.status === "Completed"||"completed" ? <FaCheckCircle /> : <FaTimesCircle />}
          <span>Status: {transaction.status}</span>
        </p>
        <p className="text-2xl font-bold text-gray-900">
          {icon} {transaction.amount} {transaction.currency_type}
        </p>
        <p className="text-gray-500 text-sm">
          <strong>Time:</strong> {format(new Date(transaction.timestamp), "PPpp")}
        </p>
      </div>
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
      className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-200 to-purple-300 p-8 flex flex-col items-center overflow-hidden relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-300 to-purple-400 opacity-25 blur-3xl animate-pulse"></div>
      
      <motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={() => {
    console.log("Navigating to /dashboard...");
    navigate("/dashboard", { replace: true });
  }}
  className="z-50 bg-purple-500 hover:bg-purple-600 transition-transform px-6 py-3 rounded-full shadow-lg mb-6 text-lg font-bold text-white flex items-center space-x-2 uppercase tracking-wide"
  style={{ position: "relative" }} // Ensures it's above other elements
>
  <FaArrowLeft /> <span>Back to Dashboard</span>
</motion.button>




      <h2 className="text-5xl font-extrabold text-center text-gray-800 drop-shadow-lg mb-8 animate-pulse">
        Transaction History
      </h2>

      <AnimatePresence>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {error && (
              <p className="text-center mt-4 text-purple-600">{error}</p>
            )}

            {transactions.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delayChildren: 0.2, staggerChildren: 0.1 }}
                className="mt-8 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
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
