                                     
                                     
                                     import React, { useState, useEffect } from 'react';
                                     import axios from 'axios';
                                     import Navbar from './components/Navbar';
                                     import { useNavigate } from 'react-router-dom';
                                     const ShoppingCart = () => {
                                         const [cartItems, setCartItems] = useState([]);
                                         const [balance, setBalance] = useState(50.0); // Example balance
                                         const navigate = useNavigate();
                                         const [showModal, setShowModal] = useState(false);
                                         const [showWarning, setShowWarning] = useState(false);
                                         const [addresses, setAddresses] = useState([]);
                                         const [selectedAddressId, setSelectedAddressId] = useState(null);
                                         const [newAddress, setNewAddress] = useState('');
                                         const [showAddressModal, setShowAddressModal] = useState(false);
                                         const [secretKey, setSecretKey] = useState('');
                                         const [isProcessing, setIsProcessing] = useState(false);
                                         const userId = localStorage.getItem("userId");      
                                         console.log(userId  )
                                         // Fetch cart items from API
                                         useEffect(() => {
                                             if(!userId){
                                                 navigate("/login")
                                             }
                                             const fetchCartItems = async () => {
                                                 try {
                                                     const response = await axios.get(`http://localhost:8000/cart/user/${userId}`);
                                                     const items = response.data.carts.map(item => ({
                                                         id: item._id,
                                                         name: item.product_name,
                                                         price: item.price,
                                                         quantity: item.quantity,
                                                         image: item.image, // Placeholder image (update if actual images are available)
                                                         stockStatus: 'In stock' // Adjust based on your API data
                                                     }));
                                                     setCartItems(items);
                                                 } catch (error) {
                                                     console.error('Error fetching cart items:', error);
                                                 }
                                             };
                                     
                                             fetchCartItems();
                                     
                                             //const userId = localStorage.getItem('userId'); // Get userId from localStorage
                                     
                                             const fetchData = async () => {
                                                 try {
                                                     const response = await axios.get(`http://localhost:8000/auth/${userId}/addresses`);
                                                     console.log(response.data.addresses)
                                                     setAddresses(response.data.addresses); 
                                                     setSelectedAddressId(response.data.addresses[0]||"")
                                                     console.log(addresses)
                                                 } catch (error) {
                                                     console.error('Error fetching addresses:', error);
                                                     // Handle error, e.g., display an error message to the user
                                                 }
                                             };
                                     
                                             
                                             fetchData();
                                             
                                         }, []);
                                     
                                         const handleQuantityChange = (id, newQuantity) => {
                                             const updatedCartItems = cartItems.map(item =>
                                                 item.id === id ? { ...item, quantity: newQuantity } : item
                                             );
                                             setCartItems(updatedCartItems);
                                         };
                                     
                                         const handleRemoveItem = async (id) => {
                                             try {
                                                 // Call the API to remove the item
                                                 const response = await axios.delete(`http://localhost:8000/cart/${id}`);
                                     
                                                 if (response.status === 200 || response.data.success) {
                                                     // Update the cart items in state
                                                     const updatedCartItems = cartItems.filter(item => item.id !== id);
                                                     setCartItems(updatedCartItems);
                                                     alert('Item removed successfully!');
                                                 } else {
                                                     alert('Failed to remove the item. Please try again.');
                                                 }
                                             } catch (error) {
                                                 console.error('Error removing item:', error);
                                                 alert('An error occurred while removing the item. Please try again.');
                                             }
                                         };
                                     
                                     
                                         const calculateSubtotal = () => {
                                             return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);
                                         };
                                     
                                         const total = (parseFloat(calculateSubtotal()) + 50).toFixed(2);
                                     
                                         const handleCheckout = () => {
                                             setShowModal(true); // Show the secret key modal first
                                         };
                                     
                                         const handleConfirmOrder = async () => {
                                             setIsProcessing(true);

                                             try {
                                                 // Verify bank account first
                                                 const accountNo = localStorage.getItem("acc-number");
                                                 if (!accountNo) {
                                                     alert("Please add your bank account details first");
                                                     return;
                                                 }
                                                 
                                                 console.log("Account Number:", accountNo);
                                                 const url = `http://localhost:8000/bank/secret/${secretKey}/${accountNo}`;

                                                 // Send a GET request to verify bank
                                                 const response = await axios.get(url);

                                                 // Check server response for success
                                                 if (response.status === 200) {
                                                     // User confirms checkout
                                                     const userId = localStorage.getItem("userId");
                                                     if (!selectedAddressId) {
                                                         alert("Please select a delivery address");
                                                         return;
                                                     }

                                                     try {
                                                         const checkoutResponse = await axios.post("http://localhost:8000/cart/checkout", {
                                                             user_id: userId,
                                                             address: selectedAddressId,
                                                         });

                                                         if (checkoutResponse.status === 200) {
                                                             alert("Order placed successfully! Waiting for supplier confirmation.");
                                                             setCartItems([]); // Clear cart items
                                                             navigate("/home"); // Redirect to home page instead of root
                                                         }
                                                     } catch (checkoutError) {
                                                         console.error("Error during checkout:", checkoutError);
                                                         if (checkoutError.response) {
                                                             // Handle specific error messages from backend
                                                             alert(checkoutError.response.data.message || "Checkout failed. Please try again.");
                                                         } else {
                                                             alert("Network error during checkout. Please try again.");
                                                         }
                                                     }
                                                 }
                                             } catch (error) {
                                                 console.error("Error:", error);
                                                 if (error.response) {
                                                     alert(error.response.data.message || "Invalid secret key or an error occurred!");
                                                 } else {
                                                     alert("Network error. Please check your connection.");
                                                 }
                                             } finally {
                                                 setIsProcessing(false);
                                                 setShowModal(false);
                                                 setSecretKey(""); // Reset secret key input
                                             }
                                         };
                                     
                                     
                                         const handleCloseModal = () => {
                                             setShowModal(false);
                                             setSecretKey('');
                                         };
                                     
                                         const handleCloseWarning = () => {
                                             setShowWarning(false);
                                         };
                                     
                                         const handleAddressChange = () => {
                                             setShowAddressModal(true);
                                         };
                                     
                                         const handleCloseAddressModal = () => {
                                             setShowAddressModal(false);
                                         };
                                     
                                         const handleSelectAddress = (id) => {
                                             //console.log(id)
                                             setSelectedAddressId(id);
                                         };
                                     
                                         const handleAddAddress = async () => {
                                             if (newAddress) { // Check if newAddress is not empty (including whitespace)
                                               try {
                                                 const userId = localStorage.getItem('userId'); 
                                                 const response = await axios.post(`http://localhost:8000/auth/${userId}/address`, {
                                                   address: newAddress
                                                 });
                                           
                                                 if (response.status === 201) { 
                                                   // Assuming the API returns the newly created address with an ID
                                                   const newAddressWithId = { 
                                                     address: newAddress 
                                                   };
                                                   setAddresses([...addresses, newAddressWithId.address]);
                                                   setSelectedAddressId(newAddressWithId.address); 
                                                   setNewAddress('');
                                                   handleCloseAddressModal(); 
                                                 } else {
                                                   console.error('Error adding address:', response.data);
                                                   // Handle API error (e.g., display an error message to the user)
                                                 }
                                           
                                               } catch (error) {
                                                 console.error('Error adding address:', error);
                                                 // Handle network or other errors
                                               }
                                             }
                                           };
                                     
                                         return (
                                             <>
                                                 {/* Navbar */}
                                                 <div className="navbar-fixed">
                                                     <Navbar />
                                                 </div>
                                                 {cartItems.length > 0 ? (
                                                     <div className="bg-gray-50 min-h-screen p-8 pt-20">
                                                         <div className="max-w-7xl mx-auto">
                                                             {/* Shopping Cart Header */}
                                                             <h1 className="text-3xl font-bold mb-8">My Cart</h1>
                                     
                                                             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:grid-row-2">
                                                                 {/* Cart Items */}
                                                                 <div className="lg:col-span-2 space-y-4 overflow-y-auto h-[545px] lg:row-span-2 scrollbar-hide">
                                                                     {cartItems.map(item => (
                                                                         <div key={item.id} className="flex items-start space-x-4 bg-white p-4 rounded-lg shadow">
                                                                             {/* Product Image */}
                                                                             <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
                                     
                                                                             {/* Product Details */}
                                                                             <div className="flex-1">
                                                                                 <div className="flex justify-between">
                                                                                     <div>
                                                                                         <h2 className="text-lg font-semibold">{item.name}</h2>
                                                                                         <p className="text-gray-900 mt-1">BDT {item.price.toFixed(2)}</p>
                                                                                     </div>
                                                                                     <button
                                                                                         onClick={() => handleRemoveItem(item.id)}
                                                                                         className="text-red-500 hover:text-red-700 font-bold text-lg"
                                                                                     >
                                                                                         &times;
                                                                                     </button>
                                                                                 </div>
                                     
                                                                                 {/* Stock Status */}
                                                                                 <p className="text-sm text-gray-500 mt-2">{item.stockStatus}</p>
                                     {/* Quantity Selector */}
                                      <div className="mt-4">
                                      <label className="block text-gray-700">Quantity</label>
                                      <span className="quantity-display">{item.quantity}</span>
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>

                  {/* Order Summary */}
                  <div className="bg-white p-6 rounded-lg shadow sticky-summary">
                      <h2 className="text-lg font-bold mb-6">Order summary</h2>

                      {/* Delivery Address Section */}
                      <div className="mb-6">
                          <h3 className="text-md font-semibold mb-2">Delivery Address</h3>
                          <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-600">
                          {selectedAddressId 
                              ? selectedAddressId 
                              : addresses.length > 0 
                              ? addresses[0] 
                              : 'No address selected or available'
                          }
                          </p>
                              <button
                                  onClick={handleAddressChange}
                                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                              >
                                  Change
                              </button>
                          </div>
                      </div>

                      <div className="space-y-4">
                          <div className="flex justify-between text-gray-700">
                              <span>Subtotal</span>
                              <span>BDT {calculateSubtotal()}</span>
                          </div>
                          <div className="flex justify-between text-gray-700">
                              <span>Shipping estimate</span>
                              <span>BDT 50</span>
                          </div>
                          <div className="flex justify-between text-gray-900 font-bold">
                              <span>Order total</span>
                              <span>BDT {total}</span>
                          </div>
                      </div>
                      <button
                          onClick={handleCheckout}
                          className="w-full bg-indigo-600 text-white py-2 px-4 mt-6 rounded-lg hover:bg-indigo-500"
                      >
                          Checkout
                      </button>
                  </div>
              </div>
          </div>
      </div>

  ):(
      <div className="text-center text-gray-500 py-10">
          <h2 className="text-2xl font-semibold">No items in your cart</h2>
          <p className="mt-2">Add items to your cart to see them here.</p>
      </div>
  )}
  
  {/* Address Change Modal */}
  {showAddressModal && (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <h3 className="text-lg font-bold mb-4">Change Delivery Address</h3>
              <div className="mb-4">
              {addresses.map((addr, index) => (
                  <div key={index} className="flex items-center mb-2">
                      <input
                      type="radio"
                      id={`addr-${index}`} // Use index as key for addresses without id
                      name="address"
                      value={addr} // Use the entire address object as value
                      checked={selectedAddressId === addr} // Compare address objects for selection
                      onChange={() => handleSelectAddress(addr)}
                      className="mr-2"
                      />
                      <label htmlFor={`addr-${index}`}>{addr}</label>
                  </div>
                  ))}
              </div>
              <div className="mb-4">
                  <input
                      type="text"
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      placeholder="Enter new address"
                      className="w-full p-2 border rounded"
                  />
              </div>
              <div className="flex justify-end">
                  <button
                      onClick={handleAddAddress}
                      className="bg-indigo-600 text-white px-4 py-2 rounded mr-2"
                  >
                      Add New Address
                  </button>
                  <button
                      onClick={handleCloseAddressModal}
                      className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                  >
                      Close
                  </button>
              </div>
          </div>
      </div>
  )}

  {/* Confirmation Modal */}
  {showModal && (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <h3 className="text-lg font-bold mb-4">Confirm Your Order</h3>
              <p className="mb-4">Enter your bank account secret key to proceed with the payment:</p>
              <div className="mb-4">
                  <input
                      type="password"
                      value={secretKey}
                      onChange={(e) => setSecretKey(e.target.value)}
                      placeholder="Enter secret key"
                      className="w-full p-2 border rounded"
                  />
              </div>
              <div className="flex justify-end">
                  <button
                      onClick={handleConfirmOrder}
                      className={`bg-indigo-600 text-white px-4 py-2 rounded mr-2 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={isProcessing}
                  >
                      {isProcessing ? 'Processing...' : 'Confirm'}
                  </button>
                  <button
                      onClick={handleCloseModal}
                      className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                  >
                      Cancel
                  </button>
              </div>
          </div>
      </div>
  )}

  {/* Warning Modal */}
  {showWarning && (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <h3 className="text-lg font-bold mb-4">Insufficient Balance</h3>
              <p className="mb-4">You don't have enough balance to complete this purchase.</p>
              <div className="flex justify-end">
                  <button
                      onClick={handleCloseWarning}
                      className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                  >
                      Close
                  </button>
              </div>
          </div>
      </div>
  )}
</>
)};
export default ShoppingCart;