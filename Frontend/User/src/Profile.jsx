import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import { API } from './config';

const Profile = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        accountNumber: '',
        balance: 0
    });
    const [bankDetails, setBankDetails] = useState({
        account_number: '',
        secret_key: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [orders, setOrders] = useState([]);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (!userId) {
            navigate('/login');
            return;
        }
        fetchUserData();
        fetchOrders();
    }, [userId, navigate]);

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`${API}/auth/user/${userId}`);
            const user = response.data;
            setUserData({
                name: user.name,
                email: user.email,
                accountNumber: user.account_number || '',
                balance: user.balance || 0
            });
        } catch (error) {
            console.error('Error fetching user data:', error);
            toast.error('Failed to fetch user data');
        }
    };

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${API}/cart/orders/${userId}`);
            setOrders(response.data.orders || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to fetch orders');
        }
    };

    const handleBankDetailsSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API}/bank/addDetails/${userId}`, bankDetails);
            toast.success('Bank details updated successfully');
            setIsEditing(false);
            fetchUserData();
        } catch (error) {
            console.error('Error updating bank details:', error);
            toast.error(error.response?.data?.message || 'Failed to update bank details');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <ToastContainer />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                    </div>

                    <div className="px-6 py-4">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Personal Details</h3>
                                <div className="mt-4 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Name</label>
                                        <p className="mt-1 text-sm text-gray-900">{userData.name}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <p className="mt-1 text-sm text-gray-900">{userData.email}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Bank Information</h3>
                                {userData.accountNumber ? (
                                    <div className="mt-4 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Account Number</label>
                                            <p className="mt-1 text-sm text-gray-900">****{userData.accountNumber.slice(-4)}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Current Balance</label>
                                            <p className="mt-1 text-sm text-gray-900">Tk {userData.balance.toFixed(2)}</p>
                                        </div>
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                        >
                                            Update Bank Details
                                        </button>
                                    </div>
                                ) : (
                                    <div className="mt-4">
                                        <p className="text-sm text-gray-700 mb-4">No bank account linked. Please add your bank details to make purchases.</p>
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                        >
                                            Add Bank Account
                                        </button>
                                    </div>
                                )}

                                {isEditing && (
                                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
                                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                                {userData.accountNumber ? 'Update Bank Details' : 'Add Bank Account'}
                                            </h3>
                                            <form onSubmit={handleBankDetailsSubmit} className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Account Number</label>
                                                    <input
                                                        type="text"
                                                        value={bankDetails.account_number}
                                                        onChange={(e) => setBankDetails({ ...bankDetails, account_number: e.target.value })}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Secret Key</label>
                                                    <input
                                                        type="password"
                                                        value={bankDetails.secret_key}
                                                        onChange={(e) => setBankDetails({ ...bankDetails, secret_key: e.target.value })}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                                                        required
                                                    />
                                                </div>
                                                <div className="flex justify-end space-x-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsEditing(false)}
                                                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Order History</h3>
                                <div className="mt-4">
                                    {orders.length > 0 ? (
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {orders.map((order) => (
                                                        <tr key={order._id}>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order._id}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {new Date(order.createdAt).toLocaleDateString()}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                    'bg-red-100 text-red-800'
                                                                }`}>
                                                                    {order.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                Tk {order.total.toFixed(2)}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-700">No orders yet</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
