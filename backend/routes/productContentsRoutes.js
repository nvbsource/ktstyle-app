const express = require('express');
const router = express.Router();
const productContentsController = require('../controllers/contentController');

router.get('/', productContentsController.getContents);

// Tạo bài viết mới
router.post('/', productContentsController.createProductContent);

// Cập nhật bài viết
router.put('/:id', productContentsController.updateProductContent);

// Lấy danh sách bài viết của sản phẩm
router.get('/:product_id', productContentsController.getProductContents);

// Xóa bài viết
router.delete('/:id', productContentsController.deleteProductContent);

module.exports = router;
