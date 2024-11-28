const express = require('express')
const {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
} = require('../controllers/cartController')

const router = express.Router()

// Middleware để tạo sessionID (giả sử mỗi khách hàng có sessionID riêng)
router.use((req, res, next) => {
  req.sessionID = req.headers['session-id'] || 'anonymous' // Lấy sessionID từ header hoặc gán mặc định
  next()
})

// Định nghĩa các route cho giỏ hàng
router.post('/add', addToCart) // Thêm sản phẩm vào giỏ hàng
router.get('/', getCart) // Lấy giỏ hàng
router.post('/remove', removeFromCart) // Xóa sản phẩm khỏi giỏ hàng
router.post('/clear', clearCart) // Xóa toàn bộ giỏ hàng

module.exports = router
