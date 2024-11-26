// topicRoutes.js
const express = require('express');
const router = express.Router();
const topicController = require('../controllers/topicController');

// Lấy tất cả danh mục
router.get('/', topicController.getTopics);

// Thêm danh mục mới
router.post('/', topicController.addTopic);

// Cập nhật danh mục dựa trên ID
router.put('/:id', topicController.updateTopic);

// Xóa danh mục dựa trên ID
router.delete('/:id', topicController.deleteTopic);

module.exports = router;
