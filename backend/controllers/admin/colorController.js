const dbRepository = require('../../config/dbRepository')
const { successResponse, errorResponse } = require('../../helpers/responseHelper')

// Lấy tất cả màu sắc
exports.getAllColors = async (req, res) => {
  try {
    const colors = await getAll('Colors')
    successResponse(res, 'Lấy danh sách màu sắc thành công', colors.data)
  } catch (error) {
    console.error('Lỗi khi lấy danh sách màu sắc:', err)
    errorResponse(res, 'Lỗi khi lấy danh sách màu sắc')
  }
}

// Lấy màu sắc theo ID
exports.getColorById = async (req, res) => {
  const { id } = req.params

  try {
    const color = await dbRepository.getById('Colors', id)
    successResponse(res, 'Lấy thông tin màu sắc thành công', color.data)
  } catch (error) {
    console.error('Lỗi khi lấy màu sắc:', err)
    errorResponse(res, 'Lỗi khi lấy màu sắc')
  }
}

// Tạo mới màu sắc
exports.createColor = async (req, res) => {
  const { name, hex_code, rgb_code } = req.body

  // Kiểm tra đầu vào
  if (!name || !hex_code || !rgb_code) {
    return errorResponse(res, 'Tên, mã hex và mã RGB là bắt buộc', 400)
  }

  // Kiểm tra nếu màu sắc đã tồn tại
  try {
    const existingColor = await dbRepository.where('Colors', { name })
    if (existingColor.data.length > 0) {
      return errorResponse(res, 'Màu sắc với tên này đã tồn tại', 400)
    }

    const colorData = { name, hex_code, rgb_code }
    const createdColor = await dbRepository.create('Colors', colorData)
    successResponse(res, 'Màu sắc đã được thêm thành công', createdColor.data)
  } catch (error) {
    console.error('Lỗi khi tạo màu sắc:', err)
    errorResponse(res, 'Lỗi khi tạo màu sắc')
  }
}

// Cập nhật màu sắc
exports.updateColor = async (req, res) => {
  const { id } = req.params
  const { name, hex_code, rgb_code } = req.body

  // Kiểm tra đầu vào
  if (!name || !hex_code || !rgb_code) {
    return errorResponse(res, 'Tên, mã hex và mã RGB là bắt buộc', 400)
  }

  // Kiểm tra nếu màu sắc đã tồn tại với tên mới
  try {
    const existingColor = await dbRepository.where('Colors', { name })
    if (
      existingColor.data.length > 0 &&
      existingColor.data[0].id !== parseInt(id)
    ) {
      return errorResponse(res, 'Màu sắc với tên này đã tồn tại', 400)
    }

    const updatedColor = await dbRepository.update('Colors', id, {
      name,
      hex_code,
      rgb_code,
    })
    successResponse(
      res,
      'Màu sắc đã được cập nhật thành công',
      updatedColor.data
    )
  } catch (error) {
    console.error('Lỗi khi cập nhật màu sắc:', err)
    errorResponse(res, 'Lỗi khi cập nhật màu sắc')
  }
}

// Xóa màu sắc
exports.deleteColor = async (req, res) => {
  const { id } = req.params

  try {
    const deletedColor = await dbRepository.remove('Colors', { id })
    successResponse(res, 'Màu sắc đã được xóa thành công', deletedColor.data)
  } catch (error) {
    console.error('Lỗi khi xoá màu sắc:', err)
    errorResponse(res, 'Lỗi khi xoá màu sắc')
  }
}
