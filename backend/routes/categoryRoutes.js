// categoryRoutes.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Lấy tất cả danh mục
router.get('/', categoryController.getCategories);

// Thêm danh mục mới
router.post('/', categoryController.addCategory);

// Cập nhật danh mục dựa trên ID
router.put('/:id', categoryController.updateCategory);

// Xóa danh mục dựa trên ID
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
