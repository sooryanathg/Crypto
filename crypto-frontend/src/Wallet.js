import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Wallet = () => {
  const navigate = useNavigate();
  const [wallets, setWallets] = useState([]);
  const [currency, setCurrency] = useState("");
  const [amount, setAmount] = useState(""); 
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const userId = localStorage.getItem("user_id");
  
  const handleWalletSelection = (walletId) => {
    localStorage.setItem("wallet_id", walletId);
    console.log("Wallet ID set in localStorage:", walletId);
    navigate(`/currency/${walletId}`);
  };
  
  useEffect(() => {
    if (!userId) {
      navigate("/login");
    } else {
      fetchWallets();
    }
  }, [navigate, userId]);

  const fetchWallets = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost/Crypto/get_wallets.php", { user_id: userId });
      if (response.data.status === "success" && Array.isArray(response.data.wallets)) {
        setWallets(response.data.wallets);
      } else {
        setMessage(response.data.message || "No wallets found.");
      }
    } catch (error) {
      setMessage("❌ Error fetching wallets.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const createWallet = async () => {
    if (!currency || !amount) {
      setMessage("❌ Please select a currency and enter an amount.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost/Crypto/create_wallet.php", {
        user_id: userId,
        currency_type: currency,
        balance: amount,
      });

      if (response.data.status === "success") {
        setMessage("✅ Wallet created successfully!");
        setCurrency("");
        setAmount("");
        fetchWallets();
      } else {
        setMessage(`❌ ${response.data.message}`);
      }
    } catch (error) {
      setMessage("❌ Error creating wallet.");
    } finally {
      setIsLoading(false);
    }
  };

  // Currency icons mapping
  const getCurrencyIcon = (type) => {
    switch(type) {
      case "Bitcoin": return "₿";
      case "Ethereum": return "Ξ";
      case "Litecoin": return "Ł";
      default: return "$";
    }
  };
  
  // Currency background gradient class
  const getCurrencyGradient = (type) => {
    switch(type) {
      case "Bitcoin": return "from-yellow-500 to-orange-500";
      case "Ethereum": return "from-blue-400 to-indigo-600";
      case "Litecoin": return "from-gray-400 to-gray-600";
      default: return "from-purple-500 to-pink-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
      {/* Header with glassmorphism effect */}
      <div className="flex justify-between items-center mb-8 bg-black bg-opacity-40 backdrop-filter backdrop-blur-lg p-4 rounded-2xl shadow-lg border border-gray-800">
        <button 
          onClick={() => navigate("/dashboard")} 
          className="bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 px-5 py-2 rounded-xl shadow-lg transform transition duration-200 hover:scale-105 flex items-center"
        >
          <span className="mr-2">←</span> Dashboard
        </button>
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Your Crypto Wallets</h2>
        <div className="w-24"></div> {/* Spacer for alignment */}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Create Wallet Section */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700">
          <h3 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">Create New Wallet</h3>
          
          <div className="space-y-6">
            <div className="relative">
              <select
                className="w-full py-3 px-4 bg-gray-800 rounded-xl border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 shadow-inner text-lg"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="">Select Cryptocurrency</option>
                <option value="Bitcoin">Bitcoin (BTC)</option>
                <option value="Ethereum">Ethereum (ETH)</option>
                <option value="Litecoin">Litecoin (LTC)</option>
              </select>
              <div className="absolute right-4 top-3 text-gray-400 pointer-events-none">▼</div>
            </div>
            
            <div className="relative">
              <input
                type="number"
                placeholder="Enter Initial Amount"
                className="w-full py-3 px-4 bg-gray-800 rounded-xl border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 shadow-inner text-lg"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              {currency && (
                <div className="absolute right-4 top-3 text-gray-400">{getCurrencyIcon(currency)}</div>
              )}
            </div>
            
            <button
              className={`w-full py-3 px-4 rounded-xl font-bold text-lg shadow-lg transform transition duration-200 hover:scale-105 ${
                currency && amount
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  : "bg-gray-700 cursor-not-allowed"
              }`}
              onClick={createWallet}
              disabled={isLoading || !currency || !amount}
            >
              {isLoading ? "Creating..." : "Create Wallet"}
            </button>
          </div>
        </div>

        {/* Existing Wallets Section */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700">
          <h3 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">Your Portfolio</h3>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : wallets.length > 0 ? (
            <div className="space-y-4">
              {wallets.map((wallet) => (
                <div 
                  key={wallet.wallet_id}
                  onClick={() => handleWalletSelection(wallet.wallet_id)}
                  className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-1 shadow-lg cursor-pointer transform transition duration-200 hover:scale-105 group"
                >
                  <div className={`bg-gradient-to-r ${getCurrencyGradient(wallet.currency_type)} rounded-xl p-4 flex justify-between items-center`}>
                    <div className="flex items-center">
                      <div className="bg-white bg-opacity-20 rounded-full w-12 h-12 flex items-center justify-center mr-4 text-2xl font-bold">
                        {getCurrencyIcon(wallet.currency_type)}
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{wallet.currency_type}</h4>
                        <p className="text-gray-200 text-sm">{wallet.symbol}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl">{wallet.balance}</p>
                      <div className="bg-black bg-opacity-30 px-3 py-1 rounded-full text-xs font-semibold mt-1 group-hover:bg-white group-hover:bg-opacity-20 transition duration-200">
                        View Details →
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-800 bg-opacity-50 rounded-xl p-8 text-center h-64 flex flex-col items-center justify-center">
              <p className="text-gray-400 text-lg mb-4">No wallets found</p>
              <p className="text-gray-500">Create your first wallet to get started</p>
            </div>
          )}
        </div>
      </div>

      {message && (
        <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 py-3 px-6 rounded-full text-white shadow-lg backdrop-filter backdrop-blur-lg bg-opacity-90 transition-all duration-300 ${
          message.includes("✅") ? "bg-green-900" : "bg-red-900"
        }`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default Wallet;