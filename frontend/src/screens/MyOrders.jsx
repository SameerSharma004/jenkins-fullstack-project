import React, { useEffect, useState } from 'react'
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function MyOrder() {
    const [orderData, setOrderData] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchMyOrder = async () => {
        const userEmail = localStorage.getItem('email')
        console.log('User email:', userEmail)
        
        try {
            const response = await fetch("http://65.0.185.151:5000/api/myorderData", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: userEmail })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json()
            console.log('Raw API response:', data)
            
            if (data.orderData && data.orderData.order_data) {
                setOrderData(data.orderData)
            }
        } catch (error) {
            console.error("Error fetching order data:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMyOrder()
    }, [])

    const renderOrderItems = (items) => {
        return items.map((item, index) => (
            <div key={index} className="col-12 mb-3">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">{item.name}</h5>
                        <p className="card-text">Quantity: {item.qty}</p>
                        <p className="card-text">Price: ₹{item.price}/-</p>
                    </div>
                </div>
            </div>
        ));
    };

    return (
        <div>
            <div>
                <Navbar />
            </div>

            <div className='container'>
                <h2 className="mt-3 mb-4">My Orders</h2>
                {loading ? (
                    <div className="alert alert-info">Loading your orders...</div>
                ) : orderData && orderData.order_data ? (
                    <div className='row'>
                        <div className="col-12">
                            <div className="card">
                                <div className="card-body">
                                    <h4 className="card-title">Order Date: {new Date(orderData.order_date).toLocaleDateString()}</h4>
                                    <div className="row">
                                        {renderOrderItems(orderData.order_data)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="alert alert-info">
                        No order data available. If you've placed orders recently, please try refreshing the page or contact support.
                    </div>
                )}
            </div>

            <Footer />
        </div>
    )
}
