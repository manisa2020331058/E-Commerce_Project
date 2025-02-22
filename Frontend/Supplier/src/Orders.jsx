import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      navigate('/login');
    } else {
      fetchOrders();
    }
  }, [userId]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`http://localhost:8000/profile/supplier/${userId}`);
      const data = await response.json();
      if (response.ok) {
        setOrders(data.supplierProducts.reverse() || []);
      } else {
        console.error('Failed to fetch orders:', data.message);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmOrder = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:8000/profile/verify/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('Order confirmed successfully! Payment has been processed.');
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, isVerified: true } : order
          )
        );
      } else {
        const errorData = await response.json();
        alert(`Failed to confirm order: ${errorData.message}`);
      }
    } catch (error) {
      console.error(`Error confirming order ${orderId}:`, error);
      alert('Error confirming order. Please try again.');
    }
  };

  const handleSummaryClick = (url) => {
    window.open(url, '_blank');
  };

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6 bg-zinc-100">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Your Orders</h1>

        {isLoading ? (
          <div className="text-center">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center text-gray-600">
            <p>No orders available.</p>
            <a
              href="/"
              className="bg-green-500 text-white px-5 py-2 rounded-lg shadow hover:bg-green-600 transition mt-4 inline-block"
            >
              Go to Products
            </a>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <table className="w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Order ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Products</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b">
                    <td className="px-6 py-4 text-gray-800">#{order._id.slice(-6)}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {order.product_list.map((product, idx) => (
                          <div key={idx}>
                            {product.product_name} x {product.quantity}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-800">
                      BDT {order.product_list.reduce(
                        (sum, product) => sum + product.price * product.quantity,
                        0
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {order.isVerified ? (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                          Confirmed
                        </span>
                      ) : (
                        <button
                          onClick={() => handleConfirmOrder(order._id)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                        >
                          Confirm Order
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default Orders;
