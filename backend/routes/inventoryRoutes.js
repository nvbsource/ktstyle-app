// inventoryRoutes.js
const express = require('express')
const router = express.Router()
const inventoryController = require('../controllers/inventoryController')

// Lấy tất cả sản phẩm
router.get('/', inventoryController.getInventory)
router.put('/:id/update-status', inventoryController.updateInventoryStatus)

module.exports = router
