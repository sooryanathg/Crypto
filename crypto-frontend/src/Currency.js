import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Currency = () => {
  const { wallet_id } = useParams();
  const navigate = useNavigate();
  const [currencyDetails, setCurrencyDetails] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [depositAmount, setDepositAmount] = useState("");

  useEffect(() => {
    if (!wallet_id) {
      setMessage("❌ Missing wallet ID.");
      setLoading(false);
      return;
    }
    fetchCurrencyDetails();
  }, [wallet_id]);

  const fetchCurrencyDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost/Crypto/get_currency.php", { wallet_id });

      if (response.data.status === "success") {
        setCurrencyDetails(response.data.currency);
        setMessage("");
      } else {
        setMessage(response.data.message || "Currency details not found.");
      }
    } catch (error) {
      setMessage("❌ Error fetching currency details.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || depositAmount <= 0) {
      setMessage("❌ Enter a valid deposit amount.");
      return;
    }

    try {
      const response = await axios.post("http://localhost/Crypto/deposit.php", {
        wallet_id,
        amount: depositAmount,
      });

      if (response.data.status === "success") {
        setMessage("✅ Deposit successful!");
        setDepositAmount("");
        fetchCurrencyDetails();
        setTimeout(() => {
          setMessage("");
        }, 3000);
      } else {
        setMessage(`❌ ${response.data.message}`);
      }
    } catch (error) {
      setMessage("❌ Error processing deposit.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <button
        onClick={() => navigate("/wallet")}
        className="bg-gray-700 px-4 py-2 rounded-lg mb-4"
      >
        ⬅ Back to Wallets
        </button>
      <h2 className="text-3xl font-bold text-center">Currency Details</h2>

      {loading ? (
        <p className="text-center mt-4 text-gray-400">⏳ Loading...</p>
      ) : currencyDetails ? (
        <div className="bg-gray-800 p-6 mt-6 rounded-xl shadow-lg w-96 mx-auto text-center">
          <h3 className="text-xl font-semibold">{currencyDetails.currency_type}</h3>
          <p className="mt-2 text-gray-300">Symbol: {currencyDetails.symbol}</p>
          <p className="mt-2 text-gray-300">Current Value: ${currencyDetails.current_value}</p>

          {/* Deposit Section */}
          <div className="mt-4">
            <input
              type="number"
              placeholder="Enter amount"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="p-2 rounded bg-gray-700 text-white w-full"
            />
            <button
              onClick={handleDeposit}
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg mt-2 w-full"
            >
              💰 Deposit
            </button>
          </div>
          
          {/* Send Crypto Button */}
          <button
            className="w-full bg-blue-500 hover:bg-blue-600 mt-4 py-2 rounded-lg"
            onClick={() => navigate(`/send/${wallet_id}`)}
          >
            Send Crypto
          </button>
        </div>
      ) : (
        <p className="text-center mt-4 text-gray-300">{message}</p>
      )}
    </div>
  );
};

export default Currency;
