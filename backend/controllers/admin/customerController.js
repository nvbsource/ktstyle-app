const dbRepository = require('../../config/dbRepository')
const { successResponse, errorResponse } = require('../../helpers/responseHelper')
const { parse, isValid } = require('date-fns')

// Lấy tất cả khách hàng với cha-con
exports.getAllCustomers = async (req, res) => {
  const { name, phone, dob, startDate, endDate } = req.query
  try {
    // Lọc khách hàng theo tên, số điện thoại và ngày sinh
    let query = 'SELECT * FROM Customers WHERE 1 = 1'
    const queryParams = []
    if (name) {
      query += ` AND name LIKE ?`
      queryParams.push(`%${name}%`)
    }
    if (phone) {
      query += ` AND phone LIKE ?`
      queryParams.push(`%${phone}%`)
    }
    if (dob) {
      query += ` AND dob = ?`
      queryParams.push(dob)
    }

    if (startDate && endDate) {
      query += ` AND DATE(created_at) BETWEEN ? AND ?`
      queryParams.push(startDate, endDate)
    }

    query += ` ORDER BY id DESC`

    const customers = await dbRepository.query(query, queryParams)

    // Trả về khách hàng cha và cây đầy đủ
    successResponse(res, 'Lấy danh sách khách hàng thành công', customers.data)
  } catch (err) {
    console.error('Lỗi khi lấy danh sách khách hàng:', err)
    errorResponse(res, 'Lỗi khi danh sách lấy khách hàng')
  }
}

exports.updateCustomer = async (req, res) => {
  const { id } = req.params
  const { name, phone, dob, facebook, zalo, instagram, more_social, note } = req.body

  try {
    // Kiểm tra dữ liệu đầu vào
    if (!name || !phone || !dob) {
      return errorResponse(
        res,
        'Tên, số điện thoại và ngày sinh là bắt buộc',
        400
      )
    }

    // Kiểm tra định dạng ngày tháng năm
    const parsedDob = parse(dob, 'yyyy-MM-dd', new Date())
    if (!isValid(parsedDob)) {
      return errorResponse(res, 'Ngày sinh không đúng định dạng', 400)
    }
    const customer = await dbRepository.getById('Customers', id)

    if (!customer.status) {
      return errorResponse(res, 'Khách hàng chỉnh sửa không tồn tại', 404)
    }

    // Cập nhật khách hàng
    await dbRepository.update('Customers', id, { name, phone, dob: parsedDob, facebook, zalo, instagram, more_social, note })
    successResponse(res, 'Khách hàng đã được cập nhật thành công')
  } catch (err) {
    console.error('Lỗi khi cập nhật khách hàng:', err)
    errorResponse(res, 'Lỗi khi cập nhật khách hàng')
  }
}
