const express = require('express')
const router = express.Router()
const variantController = require('../../controllers/admin/variantController')

// Route thêm mới biến thể
router.get('/:product_id', variantController.getAllVariants)
// Route thêm mới biến thể
router.post('/', variantController.createVariant)

// Route cập nhật biến thể
router.put('/:id', variantController.updateVariant)

// Route xóa biến thể
router.delete('/:id', variantController.deleteVariant)

module.exports = router
