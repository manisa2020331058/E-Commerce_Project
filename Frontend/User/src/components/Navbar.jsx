import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        const name = localStorage.getItem('name');
        setIsLoggedIn(!!userId);
        setUserName(name || '');
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('isAdd');
        localStorage.removeItem('account');
        localStorage.removeItem('name');
        localStorage.removeItem('user_type');
        
        setIsLoggedIn(false);
        setUserName('');
        toast.success("Logged out successfully");
    };

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/home" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                                AuroraCart
                            </Link>
                        </div>

                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link
                                to="/home"
                                className={`${
                                    window.location.pathname === '/home'
                                        ? 'border-purple-500 text-purple-900'
                                        : 'border-transparent text-gray-500 hover:border-purple-300 hover:text-purple-700'
                                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                            >
                                Home
                            </Link>
                            
                            {isLoggedIn && (
                                <Link
                                    to="/cart"
                                    className={`${
                                        window.location.pathname === '/cart'
                                            ? 'border-purple-500 text-purple-900'
                                            : 'border-transparent text-gray-500 hover:border-purple-300 hover:text-purple-700'
                                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                                >
                                    Cart
                                </Link>
                            )}
                            {isLoggedIn && (
                                <Link 
                                    to="/myorders" 
                                    className={`${
                                        window.location.pathname === '/myorders' ? 'border-purple-500 text-purple-900' : 'border-transparent text-gray-500 hover:border-purple-300 hover:text-purple-700'
                                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                                >
                                    My Orders
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
                        {isLoggedIn ? (
                            <>
                                <span className="text-gray-700">Welcome, {userName}</span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-purple-600 hover:text-purple-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center sm:hidden">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            <svg
                                className="block h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className="sm:hidden">
                <div className="pt-2 pb-3 space-y-1">
                    <Link
                        to="/home"
                        className={`${
                            window.location.pathname === '/home'
                                ? 'bg-purple-50 border-purple-500 text-purple-700'
                                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                        } block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200`}
                    >
                        Home
                    </Link>
                    
                    {isLoggedIn && (
                        <Link
                            to="/cart"
                            className={`${
                                window.location.pathname === '/cart'
                                    ? 'bg-purple-50 border-purple-500 text-purple-700'
                                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                            } block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200`}
                        >
                            Cart
                        </Link>
                    )}
                    {isLoggedIn && (
                        <Link 
                            to="/myorders" 
                            className={`${
                                window.location.pathname === '/myorders' ? 'bg-purple-50 border-purple-500 text-purple-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                            } block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200`}
                        >
                            My Orders
                        </Link>
                    )}
                </div>
                
                <div className="pt-4 pb-3 border-t border-gray-200">
                    {isLoggedIn ? (
                        <div className="space-y-1">
                            <span className="block px-4 py-2 text-base font-medium text-gray-500">
                                Welcome, {userName}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 text-base font-medium text-purple-600 hover:text-purple-800 hover:bg-gray-100 transition-colors duration-200"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            <Link
                                to="/login"
                                className="block px-4 py-2 text-base font-medium text-purple-600 hover:text-purple-800 hover:bg-gray-100 transition-colors duration-200"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="block px-4 py-2 text-base font-medium text-purple-600 hover:text-purple-800 hover:bg-gray-100 transition-colors duration-200"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
