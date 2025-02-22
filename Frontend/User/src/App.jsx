import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, BrowserRouter } from 'react-router-dom';
import Home from './Home';
import ShoppingCart from './ShoppingCart';
import Product from './Product';
import Login from './Login';
import Register from './Register';
import MyAccount from './MyAccount';
import MyOrders from './MyOrders';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const userId = localStorage.getItem('userId');
  const userType = localStorage.getItem('user_type');
  
  if (!userId || (userType !== 'buyer' && userType !== 'user')) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} > </Route>
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/cart" element={
            <ProtectedRoute>
              <ShoppingCart />
            </ProtectedRoute>
          } />
          <Route path="/product/:productId" element={
            <ProtectedRoute>
              <Product />
            </ProtectedRoute>
          } />
          <Route path="/myaccount" element={
            <ProtectedRoute>
              <MyAccount />
            </ProtectedRoute>
          } />
          <Route path="/myorders" element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </>
    
  )
}

export default App