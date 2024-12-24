const dbRepository = require('../../config/dbRepository')
const { successResponse, errorResponse } = require('../../helpers/responseHelper')

// Lấy tất cả giao dịch
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await dbRepository.getAll('Transactions')

    // Trả về giao dịch cha và cây đầy đủ
    successResponse(
      res,
      'Lấy danh sách giao dịch thành công',
      transactions.data
    )
  } catch (err) {
    console.error('Lỗi khi lấy danh sách giao dịch:', err)
    errorResponse(res, 'Lỗi khi danh sách lấy giao dịch')
  }
}
