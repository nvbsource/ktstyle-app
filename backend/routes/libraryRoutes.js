// libraryRoutes.js
const express = require('express')
const router = express.Router()
const libraryController = require('../controllers/libraryController')

// Lấy tất cả danh mục
router.get('/', libraryController.getAllLibraries)

// Thêm danh mục mới
router.post('/', libraryController.createLibrary)

// Cập nhật danh mục dựa trên ID
router.put('/:id', libraryController.updateLibrary)

// Xóa danh mục dựa trên ID
router.delete('/:id', libraryController.deleteLibrary)

module.exports = router
