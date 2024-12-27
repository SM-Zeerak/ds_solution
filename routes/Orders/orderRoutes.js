const express = require('express');
const { createOrder, getOrders } = require('../../controllers/Order/orderController');
const { updateOrderStatus } = require('../../controllers/Order/updateOrder');

const router = express.Router();


router.post('/createOrder', createOrder);


router.get('/getOrders', getOrders);


router.put('/updateOrderStatus/:id', updateOrderStatus);


module.exports = router;
