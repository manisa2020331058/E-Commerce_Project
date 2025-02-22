import React from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import Login from './login';
import AdminDashboard from './AdminDashboard';
function App() {
  return (
    <>
      
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} > </Route>
          <Route path="/" element={<AdminDashboard/>}> </Route>
        </Routes>
      </BrowserRouter>
    </>

  )
}

export default App