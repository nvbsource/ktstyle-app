// customerRoutes.js
const express = require('express')
const router = express.Router()
const customerController = require('../../controllers/admin/customerController')

// Lấy tất cả khách hàng
router.get('/', customerController.getAllCustomers)

// Cập nhật khách hàng dựa trên ID
router.put('/:id', customerController.updateCustomer)

module.exports = router
