const dbRepository = require('../../config/dbRepository') // Kết nối tới repository
const { errorResponse, successResponse } = require('../../helpers/responseHelper')

// Thêm sản phẩm vào kho (Nhập kho)
exports.addInventory = async (req, res) => {
  const { product_id, size, color, quantity } = req.body

  // Kiểm tra điều kiện đầu vào
  if (!product_id || !size || !color || !quantity || quantity <= 0) {
    return errorResponse(
      res,
      'Thông tin không hợp lệ (product_id, size, color và quantity là bắt buộc)',
      400
    )
  }

  try {
    const product = await dbRepository.getById('Products', product_id) // Kiểm tra xem sản phẩm có tồn tại không
    if (!product.data.status) {
      return errorResponse(res, 'Sản phẩm không tồn tại', 404)
    }

    const productExistInventory = await dbRepository.where('Inventory', {
      product_id,
    }) // Kiểm tra xem sản phẩm có tồn tại không
    if (!productExistInventory.data.status) {
      return errorResponse(res, 'Sản phẩm đã tồn tại trong kho', 400)
    }

    // Thêm sản phẩm vào kho
    const inventoryData = {
      product_id,
      size,
      color,
      quantity,
      status: 'available',
    }
    const result = await dbRepository.create('Inventory', inventoryData)

    return successResponse(res, 'Sản phẩm đã được thêm vào kho', result.data)
  } catch (error) {
    console.error('Lỗi khi tạo kho:', err)
    errorResponse(res, 'Lỗi khi tạo kho')
  }
}

// Cập nhật số lượng sản phẩm trong kho (sau khi cho thuê hoặc nhập kho thêm)
exports.updateInventoryQuantity = async (req, res) => {
  const { id, quantity, action } = req.body

  // Kiểm tra đầu vào
  if (!id || quantity <= 0 || !action || !['add', 'remove'].includes(action)) {
    return errorResponse(
      res,
      'Thông tin không hợp lệ (id, quantity và action là bắt buộc)',
      400
    )
  }

  try {
    const response = await dbRepository.getById('Inventory', id) // Kiểm tra tồn tại sản phẩm trong kho
    if (!inventory.data.status) {
      return errorResponse(
        res,
        'Kho hàng không tồn tại vui lòng load trang lại',
        404
      )
    }

    const inventory = response.data
    let newQuantity
    if (action === 'add') {
      newQuantity = inventory.quantity + quantity // Tăng số lượng
    } else if (action === 'remove') {
      if (inventory.quantity < quantity) {
        return errorResponse(res, 'Số lượng không đủ để giảm', 400)
      }
      newQuantity = inventory.quantity - quantity // Giảm số lượng
    }

    const updatedData = { quantity: newQuantity, updated_at: new Date() }
    await dbRepository.update('Inventory', id, updatedData) // Cập nhật lại số lượng

    return successResponse(res, 'Số lượng sản phẩm trong kho đã được cập nhật')
  } catch (error) {
    console.error('Lỗi khi cập nhật kho:', err)
    errorResponse(res, 'Lỗi khi cập nhật kho')
  }
}

// Lấy danh sách sản phẩm trong kho
exports.getInventory = async (req, res) => {
  const {
    inventory_id,
    product_id,
    product_name,
    startDate,
    endDate,
    size,
    color,
    status,
    type,
  } = req.query

  try {
    let query

    const queryParams = []
    // Xử lý điều kiện

    if (type === 'accessory') {
      query = `SELECT 
                  i.id,
                  i.quantity, 
                  i.status, 
                  p.name as product_name,
                  p.id as product_id, 
                  p.import_price,
                  p.rental_price, 
                  p.images as product_images, 
                  i.created_at, 
                  i.updated_at 
                  FROM Inventory i 
                INNER JOIN Products p ON i.item_id = p.id
                  WHERE i.item_type = 'accessory'`
    } else {
      query = `SELECT 
                  i.id,
                  i.quantity, 
                  i.status, 
                  v.id as variant_id, 
                  v.color as variant_color, 
                  v.size as variant_size,
                  p.name as product_name,
                  p.id as product_id, 
                  p.import_price,
                  p.rental_price, 
                  p.images as product_images, 
                  i.created_at, 
                  i.updated_at 
                  FROM Inventory i 
                INNER JOIN Variants v ON i.item_id = v.id
                INNER JOIN Products p ON v.product_id = p.id
                 WHERE i.item_type = 'product'`
    }

    if (inventory_id) {
      query += ` AND i.id =?`
      queryParams.push(inventory_id)
    }
    if (product_id) {
      query += ` AND p.id =?`
      queryParams.push(product_id)
    }
    if (product_name) {
      query += ` AND p.name LIKE?`
      queryParams.push(`%${product_name}%`)
    }
    if (startDate && endDate) {
      query += ` AND i.created_at BETWEEN? AND?`
      queryParams.push(startDate, endDate)
    }
    if (type === 'product') {
      if (size) {
        query += ` AND v.size =?`
        queryParams.push(size)
      }
      if (color) {
        query += ` AND v.color =?`
        queryParams.push(color)
      }
    }

    if (status) {
      query += ` AND i.status =?`
      queryParams.push(status)
    }

    const inventories = await dbRepository.query(query, queryParams)

    return successResponse(
      res,
      'Lấy danh sách kho thành công',
      inventories.data
    )
  } catch (error) {
    console.error('Lỗi khi lấy danh sách kho:', error)
    errorResponse(res, 'Lỗi khi lấy danh sách kho')
  }
}

// Cập nhật trạng thái sản phẩm trong kho (Ví dụ: đang cho thuê, sẵn có)
exports.updateInventoryStatus = async (req, res) => {
  const { id } = req.params
  const { status } = req.body

  // Kiểm tra trạng thái hợp lệ
  if (!id || !status || !['available', 'unavailable'].includes(status)) {
    return errorResponse(
      res,
      'Thông tin không hợp lệ (id và status là bắt buộc và status phải là "available" hoặc "unavailable")',
      400
    )
  }

  try {
    const inventory = await dbRepository.getById('Inventory', id) // Kiểm tra sản phẩm tồn tại
    if (!inventory.data.status) {
      return errorResponse(
        res,
        'Kho hàng không tồn tại vui lòng load trang lại',
        404
      )
    }

    // Cập nhật trạng thái sản phẩm
    const updatedData = { status, updated_at: new Date() }
    await dbRepository.update('Inventory', id, updatedData)

    return successResponse(res, 'Trạng thái sản phẩm đã được cập nhật')
  } catch (error) {
    console.error('Lỗi khi cập nhật kho:', err)
    errorResponse(res, 'Lỗi khi cập nhật kho')
  }
}

// Xóa sản phẩm khỏi kho
exports.deleteInventory = async (req, res) => {
  const { id } = req.params

  if (!id) {
    return errorResponse(res, 'ID sản phẩm kho không được để trống', 400)
  }

  try {
    const inventory = await dbRepository.getById('Inventory', id) // Kiểm tra sản phẩm tồn tại
    if (!inventory.data.status) {
      return errorResponse(
        res,
        'Kho hàng không tồn tại vui lòng load trang lại',
        404
      )
    }

    const rental = await dbRepository.where('Rentals', { inventory_id, id }) // Kiểm tra sản phẩm tồn tại
    if (!rental.data.status) {
      return errorResponse(
        res,
        'Không thể xoá kho hàng khi có đã thuê sản phẩm này',
        400
      )
    }
    // Xóa sản phẩm khỏi kho
    await dbRepository.remove('Inventory', { id })

    return successResponse(res, 'Sản phẩm đã được xóa khỏi kho')
  } catch (error) {
    console.error('Lỗi khi xoá kho:', err)
    errorResponse(res, 'Lỗi khi xoá kho')
  }
}

exports.updateInventory = async (req, res) => {
  try {
    const { id } = req.params
    const { transaction_type, quantity, amount, source, note } = req.body

    // Lấy thông tin kho hiện tại
    const inventory = await dbRepository.getById('Inventory', id)
    if (!inventory.status) {
      return responseHelper.notFound(res, 'Không tồn tại kho hàng')
    }

    const quantityParse = parseInt(quantity)

    if (isNaN(quantityParse) || quantity <= 0) {
      return errorResponse(res, 'Số lượng phải lớn hơn 0', 400)
    }

    const amountParse = parseFloat(amount)

    if (isNaN(amountParse) || amountParse < 0) {
      return errorResponse(res, 'Số tiền phải lớn hơn hoặc bằng 0', 400)
    }

    // Lấy số lượng hiện tại trước khi cập nhật
    const currentQuantity = parseInt(inventory.data.quantity)
    // Tính toán số lượng mới
    let newQuantity
    if (transaction_type === 'import') {
      newQuantity = currentQuantity + quantityParse
    } else if (transaction_type === 'export') {
      newQuantity = currentQuantity - quantityParse
      if (newQuantity < 0) {
        return errorResponse(res, 'Số lượng tồn kho không đủ', 400)
      }
    } else {
      return errorResponse(res, 'Loại giao dịch không hợp lệ', 400)
    }

    dbRepository.beginTransaction()
    // Cập nhật số lượng trong bảng inventory
    await dbRepository.update('Inventory', id, { quantity: newQuantity })

    // Tạo bản ghi lịch sử mới
    const historyData = {
      inventory_id: id,
      transaction_type,
      quantity: quantityParse, // Số lượng mới cập nhật
      quantity_before: currentQuantity, // Số lượng trước khi cập nhật
      quantity_after: newQuantity, // Số lượng sau khi cập nhật
      amount,
      source: transaction_type === 'import' ? source : '',
      note: transaction_type === 'export' ? note : '',
      created_at: new Date(),
    }
    await dbRepository.create('inventory_history', historyData)
    dbRepository.commitTransaction()
    successResponse(res, 'Inventory updated successfully')
  } catch (error) {
    console.log('Lỗi khi cập nhật kho:', error)
    dbRepository.rollbackTransaction()
    errorResponse(res, error.message)
  }
}

// Thêm hàm mới để lấy danh sách lịch sử kho
exports.getInventoryHistory = async (req, res) => {
  try {
    const { id } = req.params

    // Kiểm tra xem kho có tồn tại không
    const inventory = await dbRepository.getById('Inventory', id)
    if (!inventory) {
      return errorResponse(res, 'Inventory not found', 404)
    }

    // Lấy lịch sử kho
    const history = await dbRepository.where(
      'inventory_history',
      { inventory_id: id },
      'created_at DESC'
    )

    successResponse(res, 'Lấy lịch sử kho thành công', history.data)
  } catch (error) {
    console.error('Lỗi khi lấy lịch sử kho:', error)
    errorResponse(res, error.message)
  }
}
