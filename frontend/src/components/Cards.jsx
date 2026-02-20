import React, { useState, useRef, useEffect } from 'react';
import { useDispatchCart} from './ContextReducer';
import { toast, ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Cards(props) {
  const dispatch = useDispatchCart();
  const priceRef = useRef();

  const [qty, setQty] = useState(1); 
  const [size, setSize] = useState("half"); 

  const addToCart = async () => {
    if (props?.foodItems?._id && props?.foodItems?.name && props?.options?.[size]) {
      await dispatch({
        type: "ADD",
        id: props.foodItems._id,
        name: props.foodItems.name,
        qty: qty,
        size: size,
        price: qty * parseInt(props.options[size]),
      });
      
      if (typeof toast !== 'undefined') {
        toast.success(`${props.foodItems.name} added to cart!`, {
          position: "top-center",
          autoClose: 1000,
          transition: Slide,
          limit: 2
        });
      }
    } else {
      console.error("Invalid food item or options");
    }
  };

  let options = props.options;
  let priceOptions = options ? Object.keys(options) : [];

  useEffect(() => {
    if (priceRef.current && priceRef.current.value) {
      setSize(priceRef.current.value);
    }
  }, [setSize]);

  return (
    <div>
      <ToastContainer limit={2} />
      <div className="card mt-3 bg-dark text-light" style={{ width: "18rem" }}>
        <img src={props.foodItems?.img} style={{ height: "200px", objectFit: "fill" }} className="card-img-top" alt="..." />
        <div className="card-body">
          <h5 className="card-title">{props.foodItems?.title}</h5>
          <p className="card-text">{props.foodItems?.name}</p>
          <div className="container w-100 text-light">
            <select
              className="m-2 h-100 bg-success text-light rounded"
              value={qty}
              onChange={(e) => setQty(parseInt(e.target.value))}
            >
              {Array.from(Array(6), (e, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>

            <select
              className="m-2 h-100 bg-success text-light rounded"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              ref={priceRef}
            >
              {priceOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <br />
            <div className="d-inline h-100 fs-5">
              Price: ₹{qty * parseInt(options?.[size] || 0)} 
            </div>
          </div>
          <hr />
          <button className='btn btn-success justify-center ms-2' onClick={addToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
