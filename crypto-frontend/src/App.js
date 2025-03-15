import { BrowserRouter as Router, Route, Routes, Navigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Signup from "./Signup";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Wallet from "./Wallet";
import Currency from "./Currency";
import SendCrypto from "./SendCrypto";
import Transactions from "./Transactions";
import './index.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem("user_id");
      setIsAuthenticated(!!user);
    };

    checkAuth();

    // ✅ Fix: Listen for changes in localStorage (login/logout events)
    window.addEventListener("storage", checkAuth);

    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const logout = () => {
    localStorage.removeItem("user_id");
    setIsAuthenticated(false);
  };

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <nav className="flex justify-between items-center p-4 bg-gray-800 shadow-lg">
          <div className="text-xl font-bold">Crypto App</div>
          <div className="space-x-4">
            {!isAuthenticated ? (
              <>
                <Link to="/signup" className="px-3 py-2 bg-blue-600 rounded hover:bg-blue-700">Signup</Link>
                <Link to="/login" className="px-3 py-2 bg-green-600 rounded hover:bg-green-700">Login</Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="px-3 py-2 bg-purple-600 rounded hover:bg-purple-700">Dashboard</Link>
                <Link to="/wallet" className="px-3 py-2 bg-yellow-600 rounded hover:bg-yellow-700">Wallet</Link>
                <button onClick={logout} className="px-3 py-2 bg-red-600 rounded hover:bg-red-700">Logout</button>
              </>
            )}
          </div>
        </nav>

        <div className="p-4">
        <Routes>
  <Route path="/" element={<Navigate to="/login" />} />
  <Route path="/signup" element={!isAuthenticated ? <Signup setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/dashboard" />} />
  <Route path="/login" element={!isAuthenticated ? <Login setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/dashboard" />} />
  <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
  <Route path="/wallet" element={isAuthenticated ? <Wallet /> : <Navigate to="/login" />} />
  <Route path="/currency/:wallet_id" element={isAuthenticated ? <Currency /> : <Navigate to="/login" />} />
  <Route path="/send/:wallet_id" element={isAuthenticated ? <SendCrypto /> : <Navigate to="/login" />} />
  <Route path="/transactions" element={isAuthenticated ? <Transactions /> : <Navigate to="/login" />} />
</Routes>


        </div>
      </div>
    </Router>
  );
};

export default App;
