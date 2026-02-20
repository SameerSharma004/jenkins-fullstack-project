const express = require('express');
const router = express.Router();

router.post('/food_data', (req, res) => {
    res.send([global.food_items, global.food_category]);
});

module.exports = router;
