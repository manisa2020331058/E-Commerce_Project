import Login from "./Login";
import MyAccount from "./MyAccount";
import Orders from "./Orders";
import Register from "./register";
import SupplierDashboard from "./SupplierDashboard";
import { BrowserRouter as Router, Route, Routes, Link, BrowserRouter } from 'react-router-dom';

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          
          <Route path="/login" element={<Login />} > </Route>
          <Route path="/" element={<SupplierDashboard />}> </Route>
          <Route path="/orders" element={<Orders />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/myaccount" element={<MyAccount />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}