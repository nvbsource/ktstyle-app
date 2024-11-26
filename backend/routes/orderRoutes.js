// orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Lấy tất cả hoá đơn
router.get('/', orderController.getAllOrders);

module.exports = router;
