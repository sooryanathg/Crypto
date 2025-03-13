import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const SendCrypto = () => {
  const { wallet_id } = useParams();
  const navigate = useNavigate();
  const [recipientUserId, setRecipientUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

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
        transaction_type: "transfer", // ✅ Ensure transaction type is set to "transfer"
      });

      if (response.data.status === "success") {
        setMessage("✅ Crypto sent successfully!");
        setRecipientUserId("");
        setAmount("");

        // Clear message after 3 seconds
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
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <button onClick={() => navigate(-1)} className="bg-gray-700 px-4 py-2 rounded-lg mb-4">
        ⬅ Back
      </button>
      <h2 className="text-3xl font-bold text-center">Send Crypto</h2>

      <div className="bg-gray-800 p-6 mt-6 rounded-xl shadow-lg w-96 mx-auto">
        <label className="block text-gray-300">Recipient User ID:</label>
        <input
          type="number"
          placeholder="Enter recipient user ID"
          className="w-full mt-2 p-2 bg-gray-700 rounded-lg"
          value={recipientUserId}
          onChange={(e) => setRecipientUserId(e.target.value)}
        />

        <label className="block text-gray-300 mt-4">Amount:</label>
        <input
          type="number"
          placeholder="Enter amount"
          className="w-full mt-2 p-2 bg-gray-700 rounded-lg"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button
          className="w-full bg-blue-500 hover:bg-blue-600 mt-4 py-2 rounded-lg"
          onClick={handleSendCrypto}
        >
          Send
        </button>
      </div>

      {message && <p className="mt-4 text-center text-gray-300">{message}</p>}
    </div>
  );
};

export default SendCrypto;
