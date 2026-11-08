import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API } from '../config';
const BankAccountDialog = ({ isOpen, onClose }) => {
    const [accountNumber, setAccountNumber] = useState('');
    const [secretKey, setSecretKey] = useState('');
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const fetchBalance = async () => {
                const userId = localStorage.getItem("userId");
                const isAdd = localStorage.getItem("isAdd");
                
                if (userId && isAdd === "true") {
                    try {
                        const response = await fetch(`${API}/bank/balance/${userId}`);
                        const data = await response.json();
                        
                        if (response.ok) {
                            setBalance(data.balance);
                            setAccountNumber(data.account_number);
                        } else {
                            console.error('Error fetching balance:', data.message);
                            localStorage.setItem('isAdd', 'false');
                        }
                    } catch (error) {
                        console.error('Error fetching balance:', error);
                        localStorage.setItem('isAdd', 'false');
                    }
                }
            };

            fetchBalance();
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const userId = localStorage.getItem("userId");
            if (!userId) {
                toast.error('Please log in first');
                return;
            }

            const response = await fetch(`${API}/bank/addDetails/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    account_number: accountNumber,
                    secret_key: secretKey
                }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('accountNo', accountNumber);
                localStorage.setItem('isAdd', 'true');
                setBalance(data.user.balance);
                toast.success('Bank account linked successfully!');
                onClose();
            } else {
                toast.error(data.message || 'Failed to link bank account');
            }
        } catch (error) {
            console.error('Error linking bank account:', error);
            toast.error('Error connecting to server. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                <div className="px-6 py-4">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Bank Account Details
                        </h2>
                        {balance !== null && (
                            <p className="text-lg text-gray-700">
                                Current Balance: {balance.toLocaleString()} Tk
                            </p>
                        )}
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Account Number
                            </label>
                            <input
                                type="text"
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                                placeholder="Enter your bank account number"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Secret Key
                            </label>
                            <input
                                type="password"
                                value={secretKey}
                                onChange={(e) => setSecretKey(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                                placeholder="Enter your secret key"
                                required
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                className="mr-2 px-4 py-2 text-gray-600 hover:text-gray-800"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
                                disabled={loading}
                            >
                                {loading ? 'Linking...' : 'Link Account'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BankAccountDialog;