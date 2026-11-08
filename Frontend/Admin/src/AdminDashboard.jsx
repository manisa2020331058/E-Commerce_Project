import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import { API } from './config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [supplies, setSupplies] = useState([]);
    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${API}/auth/users`, {
                headers: {
                    'userId': localStorage.getItem('userId'),
                    'user_type': localStorage.getItem('user_type')
                }
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            if (error.response?.status === 403) {
                toast.error('Access denied. Admin privileges required.');
                navigate('/login');
            } else {
                toast.error('Failed to fetch users');
            }
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get(      `${API}/product`, {
                headers: {
                    'userId': localStorage.getItem('userId'),
                    'user_type': localStorage.getItem('user_type')
                }
            });
            setProducts(response.data.products || []);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to fetch products');
        }
    };

    const fetchSupplies = async () => {
        try {
            const response = await axios.get(      `${API}/auth/supply`, {
                headers: {
                    'userId': localStorage.getItem('userId'),
                    'user_type': localStorage.getItem('user_type')
                }
            });
            setSupplies(response.data || []);
        } catch (error) {
            console.error('Error fetching supplies:', error);
            toast.error('Failed to fetch supplies');
        }
    };

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        const userType = localStorage.getItem('user_type');

        if (!userId || userType !== 'admin') {
            toast.error('Please login as admin');
            navigate('/login');
            return;
        }

        fetchUsers();
        fetchProducts();
        fetchSupplies();
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
            <Navbar />
            <ToastContainer />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mb-12">
                    {/* Stats Cards */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-100">
                        <h3 className="text-lg font-semibold text-amber-900 mb-2">Total Users</h3>
                        <p className="text-3xl font-bold text-amber-700">{users.length}</p>
                        <p className="text-sm text-amber-600 mt-2">Active accounts in the system</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-100">
                        <h3 className="text-lg font-semibold text-amber-900 mb-2">Total Products</h3>
                        <p className="text-3xl font-bold text-amber-700">{products.length}</p>
                        <p className="text-sm text-amber-600 mt-2">Products available for sale</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-100">
                        <h3 className="text-lg font-semibold text-amber-900 mb-2">Total Supplies</h3>
                        <p className="text-3xl font-bold text-amber-700">{supplies.length}</p>
                        <p className="text-sm text-amber-600 mt-2">Active supply records</p>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-amber-100">
                    <div className="px-6 py-4 border-b border-amber-100">
                        <h2 className="text-xl font-bold text-amber-900">User Management</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-amber-100">
                            <thead className="bg-amber-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">User ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">Type</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-amber-100">
                                {users.map((user, index) => (
                                    <tr key={user._id} className={index % 2 === 0 ? 'bg-amber-50/30' : 'bg-white'}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-900">{user._id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-900">{user.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-900">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                user.user_type === 'admin' ? 'bg-red-100 text-red-800' :
                                                user.user_type === 'supplier' ? 'bg-blue-100 text-blue-800' :
                                                'bg-green-100 text-green-800'
                                            }`}>
                                                {user.user_type}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Products Table */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-8 border border-amber-100">
                    <div className="px-6 py-4 border-b border-amber-100">
                        <h2 className="text-xl font-bold text-amber-900">Product Management</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-amber-100">
                            <thead className="bg-amber-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">Product ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">Supplier</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-amber-100">
                                {products.map((product, index) => (
                                    <tr key={product._id} className={index % 2 === 0 ? 'bg-amber-50/30' : 'bg-white'}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-900">{product._id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-900">{product.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-900">${product.price}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-900">{product.supplier_name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;