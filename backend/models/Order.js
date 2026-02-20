const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  order_data: {
    type: Array,
    required: true,
  },
  order_date: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Order', OrderSchema);
