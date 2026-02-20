import React, { useEffect } from 'react';
import { useCart, useDispatchCart } from '../components/ContextReducer';
import { Button, ListGroup, ListGroupItem } from 'react-bootstrap';

const Cart = () => {
  const cartItems = useCart();
  const dispatch = useDispatchCart();

  const removeFromCart = (id) => {
    dispatch({ type: "REMOVE", id });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR" });
  };

  const globalFetch = async (url, options) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Fetch error:', error);
      throw error; // Re-throw to be handled later if needed
    }
  };

  const handleCheckout = async () => {
    try {
      const email = localStorage.getItem('email');
      if (!email) {
        return;
      }

      const order_data = cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        qty: item.qty
      }));

      // Use the globalFetch function
      const result = await globalFetch('http://localhost:5000/api/orderData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          order_data,
          order_date: new Date().toISOString()
        })
      });

      // If you want to handle the response message
      console.log(result.message);

      clearCart(); // Clear the cart after successful checkout
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  useEffect(() => {
    // Any cleanup or side effects can be handled here
    return () => {
      // Clean up actions if needed
    };
  }, []);

  return (
    <div className="container mt-3 pt-1 pb-2 bg-dark text-light" id='cart-container'>
      <h2 className="m-4 text-center">My Cart</h2>
      {cartItems.length === 0 ? (
        <h3 className='text-center text-danger'>Your cart is empty.</h3>
      ) : (
        <>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <ListGroup>
              {cartItems.map((item, index) => (
                <ListGroupItem key={index} className="d-flex justify-content-between align-items-center bg-dark text-light">
                  <div>
                    <h5>{item.name}</h5>
                    <p>Price: ₹{item.price}</p>
                    <p>Quantity: {item.qty}</p>
                  </div>
                  <Button variant="danger" onClick={() => removeFromCart(item.id)}>Remove</Button>
                </ListGroupItem>
              ))}
            </ListGroup>
          </div>
          <div className="mt-1">
            <h4>Total Price: ₹{totalPrice.toFixed(2)}</h4>
            <Button variant="success" className="me-2" onClick={handleCheckout}>Proceed to Checkout</Button>
            <Button variant="danger" onClick={clearCart}>Clear Cart</Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
