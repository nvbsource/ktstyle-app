const dbRepository = require('../config/dbRepository')
const { successResponse, errorResponse } = require('../helpers/responseHelper')

// Lấy tất cả hoá đơn
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await dbRepository.getAll('Orders')

    // Trả về hoá đơn
    successResponse(res, 'Lấy danh sách hoá đơn thành công', orders.data)
  } catch (err) {
    console.error('Lỗi khi lấy danh sách hoá đơn:', err)
    errorResponse(res, 'Lỗi khi danh sách lấy hoá đơn')
  }
}
