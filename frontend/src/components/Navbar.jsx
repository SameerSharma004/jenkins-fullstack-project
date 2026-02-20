import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from 'react-bootstrap';
import Cart from "../screens/Cart";
import { useCart } from './ContextReducer';
import Modal from '../Model';

export default function Navbar({ search, setSearch }) {
  const navigate = useNavigate();
  const cart = useCart();
  const [cartView, setCartView] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [timeoutId, setTimeoutId] = useState(null);

  const logout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    if (currentScrollY < lastScrollY) {
      setIsVisible(true);
    } else {
      setIsVisible(true);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      const newTimeoutId = setTimeout(() => {
        setIsVisible(false);
      }, 2000);
      setTimeoutId(newTimeoutId);
    }
    setLastScrollY(currentScrollY);
  }, [lastScrollY, timeoutId]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [handleScroll, timeoutId]);

  return (
    <nav className={`navbar navbar-expand-lg navbar-dark bg-dark fixed-top transition ${isVisible ? 'visible' : 'invisible'}`}>
      <div className="container-fluid">
        <Link className="navbar-brand fs-2" to="/">GoFood</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">Contact</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">Contact 2</Link>
            </li>
            {localStorage.getItem("authToken") ? (
              <li className="nav-item">
                <Link className="nav-link text-success" to="/myorders">My Orders</Link>
              </li>
            ) : null}
          </ul>
          <form className="d-flex mx-auto">
            <div className="input-group" style={{ width: "300px" }}>
              <input
                className="form-control"
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </form>
          {!localStorage.getItem("authToken") ? (
            <div className="d-flex">
              <Link to="/login" className="btn btn-success me-2">Login</Link>
              <Link to="/signup" className="btn btn-success">Sign Up</Link>
            </div>
          ) : (
            <div className="d-flex">
              <div className="btn btn-success me-2" onClick={() => setCartView(true)}>
                My Cart
                <Badge className="ms-2" bg="danger">{cart.length}</Badge>
              </div>
              {cartView ? <Modal onClose={() => setCartView(false)}><Cart /></Modal> : ""}
              <div className="btn btn-danger" onClick={logout}>Logout</div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
