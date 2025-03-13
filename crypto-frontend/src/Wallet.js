import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Wallet = () => {
  const navigate = useNavigate();
  const [wallets, setWallets] = useState([]);
  const [currency, setCurrency] = useState("");
  const [amount, setAmount] = useState(""); 
  const [message, setMessage] = useState("");

  const userId = localStorage.getItem("user_id");
  
  const handleWalletSelection = (walletId) => {
    localStorage.setItem("wallet_id", walletId); // Save selected wallet
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
    try {
      const response = await axios.post("http://localhost/Crypto/get_wallets.php", { user_id: userId });
      if (response.data.status === "success" && Array.isArray(response.data.wallets)) {
        setWallets(response.data.wallets);
      } else {
        setMessage(response.data.message || "No wallets found.");
      }
    } catch (error) {
      setMessage("❌ Error fetching wallets.");
    }
  };
  

  const createWallet = async () => {
    if (!currency || !amount) {
      setMessage("❌ Please select a currency and enter an amount.");
      return;
    }

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
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <button onClick={() => navigate("/dashboard")} className="bg-gray-700 px-4 py-2 rounded-lg mb-4">
        ⬅ Back to Dashboard
      </button>
      <h2 className="text-3xl font-bold text-center">Your Wallets</h2>
      
      {/* Create Wallet Section */}
      <div className="bg-gray-800 p-6 mt-6 rounded-xl shadow-lg w-96 mx-auto">
        <h3 className="text-xl font-semibold text-center">Create a Wallet</h3>
        <select
          className="w-full mt-4 p-2 bg-gray-700 rounded-lg"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          <option value="">Select Currency</option>
          <option value="Bitcoin">Bitcoin</option>
          <option value="Ethereum">Ethereum</option>
          <option value="Litecoin">Litecoin</option>
        </select>
        <input
          type="number"
          placeholder="Enter Amount"
          className="w-full mt-4 p-2 bg-gray-700 rounded-lg"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button
          className="w-full bg-blue-500 hover:bg-blue-600 mt-4 py-2 rounded-lg"
          onClick={createWallet}
        >
          Create Wallet
        </button>
      </div>

      {/* Existing Wallets Section */}
      <div className="bg-gray-800 p-6 mt-6 rounded-xl shadow-lg w-96 mx-auto">
        <h3 className="text-xl font-semibold text-center">Existing Wallets</h3>
        {wallets.length > 0 ? (
          <ul className="mt-4">
            {wallets.map((wallet) => (
              <li 
                key={wallet.wallet_id} 
                className="p-3 bg-gray-700 rounded-lg mt-2 cursor-pointer hover:bg-gray-600"
                onClick={() =>{
                  console.log("Navigating to:", `/currency/${wallet.wallet_id}`);
                  navigate(`/currency/${wallet.wallet_id}`)} // Redirect to Currency page
                } 
              >
                {wallet.currency_type} ({wallet.symbol}) - Balance: {wallet.balance} {wallet.symbol || ""}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center mt-4 text-gray-400">No wallets found.</p>
        )}
      </div>

      {message && <p className="mt-4 text-center text-gray-300">{message}</p>}
    </div>
  );
};

export default Wallet;
