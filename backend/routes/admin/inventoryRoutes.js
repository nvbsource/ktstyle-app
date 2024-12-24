// inventoryRoutes.js
const express = require('express')
const router = express.Router()
const inventoryController = require('../../controllers/admin/inventoryController')

// Lấy tất cả sản phẩm
router.get('/', inventoryController.getInventory)
router.put('/:id/update-status', inventoryController.updateInventoryStatus)
router.put('/:id/update', inventoryController.updateInventory);
router.get('/:id/history', inventoryController.getInventoryHistory);

module.exports = router
