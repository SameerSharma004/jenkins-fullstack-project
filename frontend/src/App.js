import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./screens/Home";
import Login from "./screens/Login";
import ContactUs from "./screens/ContactUs";
import SignUp from "./screens/SignUp";
import { CartProvider } from "./components/ContextReducer";
import { ToastContainer } from "react-toastify";
import 'bootstrap/dist/css/bootstrap.min.css'; 
import "./App.css";
import MyOrders from "./screens/MyOrders";
function App() {
  return (
    <CartProvider>
      <Router>
        <div>
          <ToastContainer />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/myorders" element={<MyOrders />} />   
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
