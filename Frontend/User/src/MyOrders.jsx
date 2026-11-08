import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import { API } from './config';

function MyOrders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (!userId) {
            navigate('/login');
            return;
        }
        fetchOrders();

        // Set up polling to check for order updates every 10 seconds
        const interval = setInterval(fetchOrders, 10000);
        return () => clearInterval(interval);
    }, [userId]);

    const fetchOrders = async () => {
        try {
            // First get user's orders
            const response = await axios.get(`${API}/profile/user/${userId}`);
            if (response.data && response.data.supplierProducts) {
                const updatedOrders = response.data.supplierProducts.reverse();
                
                // Check for newly confirmed orders
                orders.forEach(oldOrder => {
                    const updatedOrder = updatedOrders.find(newOrder => newOrder._id === oldOrder._id);
                    if (updatedOrder && updatedOrder.isVerified && !oldOrder.isVerified) {
                        // Get user's updated bank balance
                        const orderAmount = updatedOrder.product_list.reduce(
                            (sum, product) => sum + product.price * product.quantity,
                            0
                        );
                        alert(`Order #${oldOrder._id.slice(-6)} has been confirmed!\n\nAmount deducted: ৳${orderAmount}`);
                    }
                });
                
                setOrders(updatedOrders);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
            <Navbar />
            <div className="container mx-auto px-4 py-8 mt-16">
                <h1 className="text-3xl font-bold text-green-800 mb-8">My Orders</h1>
                {loading ? (
                    <div className="text-center">Loading orders...</div>
                ) : orders.length === 0 ? (
                    <div className="text-center text-gray-600">No orders found.</div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order._id} 
                                className={`bg-white rounded-lg shadow-md p-6 ${
                                    order.isVerified ? 'border-l-4 border-green-500' : 'border-l-4 border-yellow-500'
                                }`}>
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold">Order #{order._id.slice(-6)}</h2>
                                    <span className={`px-4 py-1 rounded-full text-sm font-semibold ${
                                        order.isVerified 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {order.isVerified ? 'Confirmed & Paid' : 'Awaiting Confirmation'}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    {order.product_list.map((product, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-gray-700">
                                            <span>{product.product_name} x {product.quantity}</span>
                                            <span>৳{product.price * product.quantity}</span>
                                        </div>
                                    ))}
                                    <div className="border-t pt-2 mt-2">
                                        <div className="flex justify-between items-center font-semibold">
                                            <span>Total Amount:</span>
                                            <span>৳{order.product_list.reduce(
                                                (sum, product) => sum + product.price * product.quantity, 
                                                0
                                            )}</span>
                                        </div>
                                    </div>
                                    {order.isVerified && (
                                        <div className="mt-4 text-sm text-green-600 bg-green-50 p-3 rounded">
                                            ✓ Payment Processed
                                            <br />
                                            Amount Deducted: ৳{order.product_list.reduce(
                                                (sum, product) => sum + product.price * product.quantity,
                                                0
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyOrders;
