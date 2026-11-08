import React, { useState, useEffect } from 'react';
import { FaHome, FaExchangeAlt, FaHistory, FaUserCircle } from 'react-icons/fa';
import { RiDashboardLine } from 'react-icons/ri';
import axios from 'axios';
import { API } from './config';

function BankApp() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showProfile, setShowProfile] = useState(false);
    const [amount, setAmount] = useState(0);
    const [userProfile, setUserProfile] = useState({
        name: localStorage.getItem('acc-name') || 'User',
        accountNumber: localStorage.getItem('acc-number') || '000000'
    });

    useEffect(() => {
        const fetchBankDetails = async () => {
            const key = localStorage.getItem('key');
            const accNumber = localStorage.getItem('acc-number');
            
            if (key && accNumber) {
                try {
                    const response = await axios.post(`${API}/bank`, {
                        key: key,
                        accountNumber: accNumber
                    });
                    const { amount, name, account_number } = response.data;
                    setAmount(amount || 0);
                    localStorage.setItem('amount', amount || 0);
                    localStorage.setItem('acc-name', name);
                    setUserProfile({
                        name: name,
                        accountNumber: account_number
                    });
                } catch (error) {
                    console.error('Error fetching bank details:', error);
                    handleLogout();
                }
            }
        };

        fetchBankDetails();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('acc-name');
        localStorage.removeItem('acc-number');
        localStorage.removeItem('key');
        localStorage.removeItem('amount');
        window.location.href = '/login';
    };

    const ProfileDropdown = () => (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
            <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-900">{userProfile.name}</p>
                <p className="text-xs text-gray-500">Account: {userProfile.accountNumber}</p>
            </div>
            <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50">Sign out</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
            {/* Top Navbar */}
            <nav className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                                    AuroraBank
                                </h1>
                            </div>
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                <button
                                    onClick={() => setActiveTab('dashboard')}
                                    className={`
                                        ${
                                            activeTab === 'dashboard'
                                                ? 'border-purple-500 text-purple-900'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium
                                    `}
                                >
                                    <RiDashboardLine className="mr-2" />
                                    Dashboard
                                </button>
                                <button
                                    onClick={() => setActiveTab('transfer')}
                                    className={`
                                        ${
                                            activeTab === 'transfer'
                                                ? 'border-purple-500 text-purple-900'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium
                                    `}
                                >
                                    <FaExchangeAlt className="mr-2" />
                                    Transfer
                                </button>
                                <button
                                    onClick={() => setActiveTab('history')}
                                    className={`
                                        ${
                                            activeTab === 'history'
                                                ? 'border-purple-500 text-purple-900'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium
                                    `}
                                >
                                    <FaHistory className="mr-2" />
                                    History
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="relative">
                                <button
                                    onClick={() => setShowProfile(!showProfile)}
                                    className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 focus:outline-none"
                                >
                                    <FaUserCircle className="h-8 w-8" />
                                    <span className="hidden md:block">{userProfile.name}</span>
                                </button>
                                {showProfile && <ProfileDropdown />}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {activeTab === 'dashboard' && (
                    <div className="bg-white rounded-lg shadow-xl p-6">
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Welcome back, {userProfile.name}!</h2>
                            <p className="text-gray-600">Account Number: {userProfile.accountNumber}</p>
                        </div>
                        
                        <div className="bg-gradient-to-r from-purple-500 to-purple-700 rounded-lg p-6 text-white">
                            <p className="text-lg font-medium opacity-90">Current Amount</p>
                            <h3 className="text-4xl font-bold mt-2">Tk {Number(amount).toLocaleString()}</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                            <div className="bg-purple-50 rounded-lg p-6">
                                <h4 className="text-lg font-semibold text-purple-900 mb-4">Quick Actions</h4>
                                <div className="space-y-4">
                                    <button className="w-full bg-white text-purple-700 border border-purple-200 rounded-lg px-4 py-2 hover:bg-purple-50 transition-colors duration-200">
                                        New Transfer
                                    </button>
                                    <button className="w-full bg-white text-purple-700 border border-purple-200 rounded-lg px-4 py-2 hover:bg-purple-50 transition-colors duration-200">
                                        View Statement
                                    </button>
                                </div>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-6">
                                <h4 className="text-lg font-semibold text-purple-900 mb-4">Recent Transactions</h4>
                                <div className="space-y-4">
                                    <p className="text-gray-600">No recent transactions</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'transfer' && (
                    <div className="bg-white rounded-lg shadow-xl p-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Transfer Money</h2>
                        <div className="max-w-md mx-auto">
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Recipient Account Number</label>
                                    <input
                                        type="text"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                        placeholder="Enter account number"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Amount (Tk)</label>
                                    <input
                                        type="number"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                        placeholder="Enter amount"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                >
                                    Transfer Money
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="bg-white rounded-lg shadow-xl p-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Transaction History</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">No transactions found</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default BankApp;
