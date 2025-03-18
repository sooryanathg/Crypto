import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import anime from "animejs";
import Confetti from "react-confetti";

const API_BASE_URL = "http://crypto-system.great-site.net/";

const Currency = () => {
  const { wallet_id } = useParams();
  const navigate = useNavigate();
  const [currencyDetails, setCurrencyDetails] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [depositAmount, setDepositAmount] = useState("");
  const depositButtonRef = useRef(null);
  const backButtonRef = useRef(null);
  const sendButtonRef = useRef(null);
  const currencyCardRef = useRef(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!wallet_id) {
      setMessage("❌ Missing wallet ID.");
      setLoading(false);
      return;
    }
    fetchCurrencyDetails();
    fetchWalletBalance();
  }, [wallet_id]);

  useLayoutEffect(() => {
    if (backButtonRef.current && sendButtonRef.current && depositButtonRef.current) {
      animateButtons();
    }
    if (currencyCardRef.current) {
      animateCardEntry();
    }
  }, [currencyDetails, walletBalance]);

  const animateButtons = () => {
    anime({
      targets: [backButtonRef.current, sendButtonRef.current, depositButtonRef.current],
      scale: [0.8, 1],
      opacity: [0, 1],
      duration: 800,
      delay: anime.stagger(100),
      easing: "easeOutElastic(1, .8)",
    });
  };

  const animateCardEntry = () => {
    anime({
      targets: currencyCardRef.current,
      translateY: [-50, 0],
      opacity: [0, 1],
      duration: 1000,
      easing: "easeOutQuad",
    });
  };

  const fetchCurrencyDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}get_currency.php`, { wallet_id });

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

  const fetchWalletBalance = async () => {
    try {
      // Fetch user_id from localStorage (assuming user is logged in)
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        setMessage("❌ User not logged in.");
        return;
      }

      // Fetch wallet details
      const response = await axios.get(`http://localhost/Crypto/get_wallets.php?user_id=${userId}`);
      console.log("Wallets Response:", response.data);

      if (response.data.status === "success") {
        // Find the correct wallet balance using wallet_id
        const wallet = response.data.wallets.find((w) => w.wallet_id == wallet_id);
        setWalletBalance(wallet ? wallet.balance : "N/A");
      } else {
        setWalletBalance(null);
        setMessage("❌ Error fetching wallet balance.");
      }
    } catch (error) {
      setMessage("❌ Error fetching wallet balance.");
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
        fetchWalletBalance(); // Refresh wallet balance
        animateDepositSuccess();
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
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

  const animateDepositSuccess = () => {
    anime({
      targets: depositButtonRef.current,
      scale: [1, 1.2, 1],
      rotate: "1turn",
      duration: 800,
      easing: "easeInOutQuad",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-100 to-white text-gray-800 p-6 relative">
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      <button
        ref={backButtonRef}
        onClick={() => navigate("/wallet")}
        className="bg-gray-300 px-4 py-2 rounded-lg mb-4 hover:bg-gray-400 transition-colors duration-300 shadow-md"
      >
        ⬅ Back to Wallets
      </button>
      <h2 className="text-4xl font-extrabold text-center mb-6 text-gray-900">Currency Details</h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-600"></div>
        </div>
      ) : currencyDetails ? (
        <div
          ref={currencyCardRef}
          className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg p-8 mt-8 rounded-3xl shadow-2xl w-96 mx-auto text-center border border-gray-300"
        >
          <h3 className="text-3xl font-semibold mb-4 text-gradient-to-r from-orange-400 to-yellow-500">
            {currencyDetails.currency_type}
          </h3>
          <p className="mt-2 text-gray-700">
            Symbol: <span className="text-blue-600">{currencyDetails.symbol}</span>
          </p>
          <p className="mt-2 text-gray-700">
            Current Value: <span className="text-green-600">${currencyDetails.current_value}</span>
          </p>
          <p className="mt-2 text-gray-700 text-lg font-bold">
            Your Balance:{" "}
            <span className="text-purple-600">
              {walletBalance !== null ? `${walletBalance} ${currencyDetails.symbol}` : "Loading..."}
            </span>
          </p>

          <div className="mt-6">
            <input
              type="number"
              placeholder="Enter amount"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="p-3 rounded-xl bg-gray-200 text-gray-800 w-full mb-3 focus:ring-2 focus:ring-blue-500 transition-shadow duration-300"
            />
            <button
              ref={depositButtonRef}
              onClick={handleDeposit}
              className="bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 px-6 py-3 rounded-full mt-2 w-full font-semibold shadow-md transition-transform transform hover:scale-105 active:scale-95 transition-all duration-200"
            >
              💰 Deposit
            </button>
          </div>
          <button
            ref={sendButtonRef}
            className="w-full bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 mt-6 py-3 rounded-full font-semibold shadow-md transition-transform transform hover:scale-105 active:scale-95 transition-all duration-200"
            onClick={() => navigate(`/send/${wallet_id}`)}
          >
            Send Crypto 🚀
          </button>
        </div>
      ) : (
        <p className="text-center mt-8 text-gray-600">{message}</p>
      )}
    </div>
  );
};

export default Currency;
