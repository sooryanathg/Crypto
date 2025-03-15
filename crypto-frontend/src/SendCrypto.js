import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import anime from "animejs";
import Confetti from "react-confetti";

const SendCrypto = () => {
  const { wallet_id } = useParams();
  const navigate = useNavigate();
  const [recipientUserId, setRecipientUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const sendFormRef = useRef(null);
  const sendButtonRef = useRef(null);

  useEffect(() => {
    anime({
      targets: sendFormRef.current,
      translateY: [-50, 0],
      opacity: [0, 1],
      duration: 800,
      easing: "easeOutSine",
    });
  }, []);

  const handleSendCrypto = async () => {
    if (!recipientUserId || !amount) {
      setMessage("❌ Please enter recipient user ID and amount.");
      return;
    }

    try {
      const response = await axios.post("http://localhost/Crypto/send_crypto.php", {
        wallet_id,
        recipient_user_id: recipientUserId,
        amount,
        transaction_type: "transfer",
      });

      if (response.data.status === "success") {
        setMessage("✅ Crypto sent successfully!");
        setRecipientUserId("");
        setAmount("");
        setShowConfetti(true);
        anime({
          targets: sendButtonRef.current,
          scale: [1, 1.1, 1],
          rotate: "360deg",
          duration: 1000,
          easing: "easeInOutElastic(1, .8)",
        });
        setTimeout(() => setShowConfetti(false), 3000);
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(`❌ ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error sending crypto:", error);
      setMessage("❌ Error sending crypto.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-200 to-purple-300 text-gray-800 p-6 relative">
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      <button
        onClick={() => navigate(-1)}
        className="bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 px-5 py-3 rounded-xl mb-6 shadow-lg transition-transform duration-300 text-white"
      >
        ⬅ Back
      </button>
      <h2 className="text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse">
        Send Crypto
      </h2>

      <div
        ref={sendFormRef}
        className="bg-gradient-to-br from-purple-300 to-purple-500 backdrop-blur-md border border-gray-300 p-8 rounded-3xl shadow-2xl w-96 mx-auto transform transition-all duration-300 hover:scale-105"
      >
        <label className="block text-gray-800 font-semibold mb-2">Recipient User ID:</label>
        <input
          type="number"
          placeholder="Enter recipient user ID"
          className="w-full p-4 rounded-xl bg-white/90 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 hover:bg-gray-100/90 mb-4"
          value={recipientUserId}
          onChange={(e) => setRecipientUserId(e.target.value)}
        />

        <label className="block text-gray-800 font-semibold mb-2">Amount:</label>
        <input
          type="number"
          placeholder="Enter amount"
          className="w-full p-4 rounded-xl bg-white/90 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 hover:bg-gray-100/90 mb-6"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button
          ref={sendButtonRef}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-blue-500 hover:to-purple-600 transition-transform duration-300 text-white font-semibold text-lg flex justify-center items-center shadow-lg hover:shadow-xl"
          onClick={handleSendCrypto}
        >
          Send
        </button>
      </div>

      {message && <p className="mt-6 text-center text-purple-600 font-medium">{message}</p>}
    </div>
  );
};

export default SendCrypto;
