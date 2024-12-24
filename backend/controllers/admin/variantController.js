const db = require('../../config/db')
const dbRepository = require('../../config/dbRepository')
const { successResponse, errorResponse } = require('../../helpers/responseHelper')

const variantController = {
  getAllVariants: async (req, res) => {
    const { product_id } = req.params
    const query = `SELECT v.*, i.quantity FROM Variants v
        LEFT JOIN Inventory i on v.id = i.item_id
        WHERE v.product_id = ?
        ORDER BY v.id DESC`
    try {
      const variants = await dbRepository.query(query, [product_id])

      // Trả về biến thể cha và cây đầy đủ
      successResponse(res, 'Lấy danh sách biến thể thành công', variants.data)
    } catch (err) {
      console.error('Lỗi khi lấy danh sách biến thể:', err)
      errorResponse(res, 'Lỗi khi danh sách lấy biến thể')
    }
  },
  /**
   * Thêm một biến thể mới
   */
  createVariant: async (req, res) => {
    try {
      const { product_id, size, color } = req.body
      const quantity = null;
      // Kiểm tra dữ liệu đầu vào
      if (!product_id || !size || !color) {
        return errorResponse(
          res,
          'Vui lòng cung cấp đầy đủ thông tin: product_id, size, color',
          400
        )
      }

      if (quantity && quantity < 0) {
        return errorResponse(res, 'Số lượng phải lớn hơn 0', 400)
      }

      const parsedQuantity = parseInt(quantity, 10)
      if (quantity && isNaN(parsedQuantity)) {
        return errorResponse(res, 'Số lượng phải là một số hợp lệ', 400)
      }

      const existsVariant = await dbRepository.exists('Variants', {
        size,
        color,
        product_id,
      })

      if (existsVariant) {
        return errorResponse(res, 'Kích thướt và màu này đã tồn tại', 400)
      }

      dbRepository.beginTransaction()

      // Thêm mới biến thể vào database
      const result = await dbRepository.create('Variants', {
        product_id,
        size,
        color,
      })

      await dbRepository.create('Inventory', {
        item_id: result.data.id,
        quantity: parsedQuantity || 0,
        item_type: 'product',
        status: 'available',
      })

      dbRepository.commitTransaction()

      // Trả về kết quả thành công
      return successResponse(
        res,
        'Biến thể đã được thêm thành công',
        result.data
      )
    } catch (error) {
      dbRepository.rollbackTransaction()
      console.error('Lỗi khi thêm biến thể:', error.message)
      return errorResponse(res, 'Lỗi khi thêm biến thể')
    }
  },

  /**
   * Cập nhật thông tin biến thể
   */
  updateVariant: async (req, res) => {
    try {
      const id = req.params.id
      const { size, color } = req.body

      // Kiểm tra dữ liệu đầu vào
      if (!size && !color) {
        return errorResponse(
          res,
          'Vui lòng cung cấp ít nhất một thông tin để cập nhật: size, color',
          400
        )
      }

      // Kiểm tra xem biến thể có tồn tại không
      const variant = await dbRepository.getById('Variants', id)
      if (!variant.status) {
        return errorResponse(res, `Biến thể với ID ${id} không tồn tại`, 404)
      }

      // Cập nhật biến thể
      const updatedData = {}
      if (size) updatedData.size = size
      if (color) updatedData.color = color

      const result = await dbRepository.update('Variants', id, updatedData)

      // Trả về kết quả thành công
      return successResponse(
        res,
        'Biến thể đã được cập nhật thành công',
        result
      )
    } catch (error) {
      console.error('Lỗi khi cập nhật biến thể:', error.message)
      return errorResponse(res, 'Lỗi khi cập nhật biến thể')
    }
  },

  /**
   * Xóa một biến thể
   */
  deleteVariant: async (req, res) => {
    try {
      const id = req.params.id

      // Kiểm tra xem biến thể có tồn tại không
      const variant = await dbRepository.getById('Variants', id)
      if (!variant.status) {
        return errorResponse(res, `Biến thể với ID ${id} không tồn tại`, 404)
      }

      const inventory = await dbRepository.where('Rentals', { item_id: id })
      if (inventory.data.quantity > 0) {
        return errorResponse(
          res,
          `Biến thể này đã có khách thuê, bạn không thể xóa`,
          400
        )
      }
      dbRepository.beginTransaction()
      await dbRepository.remove('Inventory', { item_id: id })
      await dbRepository.remove('Variants', { id })
      dbRepository.commitTransaction()
      // Trả về kết quả thành công
      return successResponse(res, 'Biến thể đã được xóa thành công')
    } catch (error) {
      dbRepository.rollbackTransaction()
      console.error('Lỗi khi xóa biến thể:', error.message)
      return errorResponse(res, 'Lỗi khi xóa biến thể')
    }
  },
}

module.exports = variantController
