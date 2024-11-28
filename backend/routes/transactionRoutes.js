// transactionRoutes.js
const express = require('express')
const router = express.Router()
const transactionController = require('../controllers/transactionController')

// Lấy tất cả khách hàng
router.get('/', transactionController.getAllTransactions)

module.exports = router
