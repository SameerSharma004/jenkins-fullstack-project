const express = require("express");
const router = express.Router();
const { Order } = require("../models/Orders"); // Keep this if you still want to use the Order model
// Import or define any other required models

router.post("/orderData", async (req, res) => {
  try {
    const db = global.dbClient.db("gofoodmern");
    const existingOrder = await db.collection("orders").findOne({ email: req.body.email });

    if (existingOrder) {
      // Append to the existing order
      existingOrder.order_data.push(...req.body.order_data);
      existingOrder.order_date = req.body.order_date || new Date();

      // Update the existing order using the native driver
      const updatedOrder = await db.collection("orders").updateOne(
        { email: req.body.email }, // Filter
        { $set: { order_data: existingOrder.order_data, order_date: existingOrder.order_date } } // Update
      );

      res.json({ success: true, message: 'Order updated successfully', orderId: existingOrder._id });
    } else {
      // Create a new order
      const { email, order_data, order_date } = req.body;

      const newOrder = {
        email,
        order_data,
        order_date: order_date || new Date()
      };

      // Insert new order using the native driver
      const savedOrder = await db.collection("orders").insertOne(newOrder);

      res.json({ success: true, message: 'Order placed successfully', orderId: savedOrder.insertedId });
    }
  } catch (error) {
    console.error('Error in /orderData:', error); // Logging the error for debugging
    res.status(500).json({ success: false, error: 'Failed to save order', details: error.message });
  }
});

router.post("/myOrderData", async (req, res) => {
  try {
    const db = global.dbClient.db("gofoodmern");
    const myData = await db.collection("orders").findOne({ email: req.body.email });

    if (myData) {
      res.json({ success: true, orderData: myData });
    } else {
      res.json({ success: false, message: 'No orders found for this email.' });
    }
  } catch (error) {
    console.error('Error in /myOrderData:', error); // Logging the error for debugging
    res.status(500).json({ success: false, error: 'Failed to fetch order data', details: error.message });
  }
});

module.exports = router;
