import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onAboutUsClick }) => {
  const [balanceText, setBalanceText] = useState('Balance');
  const [showingBalance, setShowingBalance] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Login state
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  const handleCheckBalance = () => {
    if (!showingBalance) {
      // Simulate fetching balance (replace this with actual balance fetching logic)
      setBalanceText('$2,350.00');
      setShowingBalance(true);

      // After 5 seconds, revert back to "Check Balance"
      setTimeout(() => {
        setBalanceText('Balance');
        setShowingBalance(false);
      }, 5000);
    }
  };

  const handleLogout = () => {
    // Remove user-related data from localStorage
    localStorage.removeItem('userId');
    localStorage.removeItem('name');
    localStorage.removeItem('isAdd');
    localStorage.removeItem('account');

    // Update state to reflect logout
    setIsLoggedIn(false);
    setUserName('');
    navigate('/login');
  };

  useEffect(() => {
    // Check if userId exists in localStorage
    const userId = localStorage.getItem('userId');
    const name = localStorage.getItem('name');
    setIsLoggedIn(!!userId); // Convert to boolean
    setUserName(name || '');
  }, []);

  const navItems = (
    <>
      <li>
        <a>Home</a>
      </li>
      <li>
        <a>Cart</a>
      </li>
      <li>
        <a onClick={onAboutUsClick}>About us</a>
      </li>
      <li>
        <a>Jobs</a>
      </li>
    </>
  );

  return (
    <nav className="bg-gradient-to-r from-amber-800 to-amber-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <a href="/" className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-white">
                  AuroraCart
                </span>
                <span className="px-2 py-1 text-sm font-medium bg-amber-900/20 text-amber-100 rounded-md">
                  Admin
                </span>
              </a>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isLoggedIn && (
              <>
                <span className="text-amber-100">
                  Welcome, {userName}
                </span>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-amber-900 bg-amber-100 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;