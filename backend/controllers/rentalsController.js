const db = require('../config/dbRepository') // Import tiện ích database
const { successResponse, errorResponse } = require('../helpers/responseHelper') // Import response helper

// Lấy danh sách tất cả bản ghi cho thuê
const getAllRentals = async (req, res) => {
  try {
    const result = await db.getAll('Rentals') // Chèn trực tiếp tên bảng
    successResponse(res, 'Lấy danh sách Rentals thành công', result.data)
  } catch (error) {
    console.error('Lỗi khi lấy danh sách Rentals:', error)
    errorResponse(res, 'Lỗi khi lấy danh sách Rentals')
  }
}

// Lấy chi tiết một bản ghi cho thuê theo ID
const getRentalById = async (req, res) => {
  const { id } = req.params
  try {
    const result = await db.getById('Rentals', id) // Chèn trực tiếp tên bảng
    if (!result.status) {
      return errorResponse(res, `Rental với ID ${id} không tồn tại`, 404)
    }
    successResponse(res, `Lấy Rental với ID ${id} thành công`, result.data)
  } catch (error) {
    console.error(`Lỗi khi lấy Rental với ID ${id}:`, error)
    errorResponse(res, 'Lỗi khi lấy thông tin Rental')
  }
}

// Cập nhật một bản ghi cho thuê theo ID
const updateRental = async (req, res) => {
  const { id } = req.params
  const { start_date, end_date, shiped_date, return_date, status } = req.body

  try {
    const updatedRental = {
      ...(start_date && { start_date }),
      ...(end_date && { end_date }),
      ...(shiped_date && { shiped_date }),
      ...(return_date && { return_date }),
      ...(status && { status }),
    }

    const result = await db.update('Rentals', id, updatedRental)
    if (!result.status) {
      return errorResponse(res, `Rental với ID ${id} không tồn tại`, 404)
    }
    successResponse(res, 'Cập nhật Rental thành công')
  } catch (error) {
    console.error(`Lỗi khi cập nhật Rental với ID ${id}:`, error)
    errorResponse(res, 'Lỗi khi cập nhật Rental')
  }
}

// Xuất các hàm để sử dụng trong router
module.exports = {
  getAllRentals,
  getRentalById,
  updateRental,
}
