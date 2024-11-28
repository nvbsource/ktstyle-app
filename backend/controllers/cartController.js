const redisClient = require('../config/redis')

// Thêm sản phẩm vào giỏ hàng
const addToCart = async (req, res) => {
  const { sessionID } = req // Giả sử sessionID được middleware tạo trước đó
  const { productId, quantity } = req.body

  try {
    // Lấy giỏ hàng hiện tại từ Redis
    const cart = JSON.parse(await redisClient.get(sessionID)) || []

    // Tìm sản phẩm trong giỏ hàng
    const existingProduct = cart.find((item) => item.productId === productId)

    if (existingProduct) {
      existingProduct.quantity += quantity // Cập nhật số lượng
    } else {
      cart.push({ productId, quantity }) // Thêm sản phẩm mới
    }

    // Lưu lại giỏ hàng vào Redis
    await redisClient.set(sessionID, JSON.stringify(cart), 'EX', 3600) // Giỏ hàng hết hạn sau 1 giờ

    res
      .status(200)
      .json({ message: 'Sản phẩm đã được thêm vào giỏ hàng', cart })
  } catch (error) {
    console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error)
    res.status(500).json({ error: 'Không thể thêm sản phẩm vào giỏ hàng' })
  }
}

// Lấy giỏ hàng
const getCart = async (req, res) => {
  const { sessionID } = req

  try {
    const cart = JSON.parse(await redisClient.get(sessionID)) || []
    res.status(200).json(cart)
  } catch (error) {
    console.error('Lỗi khi lấy giỏ hàng:', error)
    res.status(500).json({ error: 'Không thể lấy giỏ hàng' })
  }
}

// Xóa sản phẩm khỏi giỏ hàng
const removeFromCart = async (req, res) => {
  const { sessionID } = req
  const { productId } = req.body

  try {
    const cart = JSON.parse(await redisClient.get(sessionID)) || []
    const updatedCart = cart.filter((item) => item.productId !== productId)

    await redisClient.set(sessionID, JSON.stringify(updatedCart), 'EX', 3600)

    res
      .status(200)
      .json({
        message: 'Sản phẩm đã được xóa khỏi giỏ hàng',
        cart: updatedCart,
      })
  } catch (error) {
    console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng:', error)
    res.status(500).json({ error: 'Không thể xóa sản phẩm khỏi giỏ hàng' })
  }
}

// Xóa toàn bộ giỏ hàng
const clearCart = async (req, res) => {
  const { sessionID } = req

  try {
    await redisClient.del(sessionID)
    res.status(200).json({ message: 'Giỏ hàng đã được xóa' })
  } catch (error) {
    console.error('Lỗi khi xóa giỏ hàng:', error)
    res.status(500).json({ error: 'Không thể xóa giỏ hàng' })
  }
}

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
}
