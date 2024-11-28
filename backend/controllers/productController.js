const db = require('../config/db')
const { successResponse, errorResponse } = require('../helpers/responseHelper')
const dbRepository = require('../config/dbRepository')

// Lấy danh sách sản phẩm
exports.getProducts = async (req, res) => {
  const { name, library, category, priceRange, startDate, endDate } = req.query // Lấy các bộ lọc từ query params

  let queryStr = `
        SELECT p.id, p.name, p.description, p.notes, p.images, p.import_price, p.rental_price,
               GROUP_CONCAT(DISTINCT l.id) AS library_ids, 
               GROUP_CONCAT(DISTINCT l.name) AS library_names, 
               c.id as category_id, 
               c.name as category_name, 
               p.status, 
               p.created_at, 
               p.updated_at
        FROM Products p
        LEFT JOIN Categories c ON p.category_id = c.id
        LEFT JOIN ProductLibrary pl ON p.id = pl.product_id
        LEFT JOIN Library l ON pl.library_id = l.id
        WHERE 1=1
    `

  // Thêm bộ lọc theo tên sản phẩm (nếu có)
  const queryParams = []
  if (name) {
    queryStr += ` AND p.name LIKE ?`
    queryParams.push(`%${name}%`)
  }

  // Thêm bộ lọc theo giá (nếu có)
  if (priceRange) {
    const priceParts = priceRange.split(',')

    if (
      priceParts.length === 2 &&
      !isNaN(priceParts[0]) &&
      !isNaN(priceParts[1])
    ) {
      const minPrice = Number(priceParts[0])
      const maxPrice = Number(priceParts[1])

      if (minPrice <= maxPrice) {
        queryStr += ` AND p.import_price BETWEEN ? AND ?`
        queryParams.push(minPrice, maxPrice)
      } else {
        return errorResponse(res, 'Giá nhập phải nhỏ hơn hoặc bằng giá thuê')
      }
    } else {
      return errorResponse(
        res,
        'Giá nhập không hợp lệ. Định dạng đúng là minPrice,maxPrice.'
      )
    }
  }

  // Thêm bộ lọc theo ngày (nếu có)
  if (startDate && endDate) {
    queryStr += ` AND DATE(p.created_at) BETWEEN ? AND ?`
    queryParams.push(startDate, endDate)
  }

  queryStr += ` GROUP BY p.id`
  queryStr += ` ORDER BY p.id DESC`

  try {
    // Sử dụng query để lấy kết quả
    const results = await dbRepository.query(queryStr, queryParams)

    // Xử lý kết quả để xây dựng danh sách sản phẩm với tất cả các thư viện
    let products = results.data.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      notes: row.notes,
      images: row.images,
      import_price: row.import_price,
      rental_price: row.rental_price,
      category: row.category_id
        ? { id: row.category_id, name: row.category_name }
        : null,
      libraries: row.library_ids
        ? row.library_ids.split(',').map((id, index) => ({
            id: parseInt(id),
            name: row.library_names.split(',')[index],
          }))
        : [],
      created_at: row.created_at,
      updated_at: row.updated_at,
    }))

    products = products.filter((product) => {
      const matchLibrary =
        !library ||
        product.libraries?.some((libraryObj) => libraryObj.id == library)
      const matchCategory =
        !category || product.category?.id === parseInt(category)

      return matchLibrary && matchCategory
    })
    console.log({ products })

    // Trả về dữ liệu sản phẩm
    successResponse(res, 'Danh sách sản phẩm đã được lấy thành công', products)
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sản phẩm:', error)
    errorResponse(res, 'Lỗi khi lấy danh sách sản phẩm')
  }
}

// Thêm sản phẩm mới
exports.addProduct = async (req, res) => {
  const {
    name,
    description,
    notes,
    libraries,
    images,
    category_id,
    import_price,
    rental_price,
  } = req.body
  let errors = {}

  // Kiểm tra các trường
  if (!name || name.trim() === '') {
    errors.name = 'Vui lòng nhập tên sản phẩm'
  }

  if (!description || description.trim() === '') {
    errors.description = 'Vui lòng nhập mô tả sản phẩm'
  }

  if (!import_price || isNaN(import_price) || import_price < 0) {
    errors.import_price = 'Giá nhập phải là một số và lớn hơn hoặc bằng 0'
  }

  if (!rental_price || isNaN(rental_price) || rental_price < 0) {
    errors.rental_price = 'Giá cho thuê phải là một số và lớn hơn hoặc bằng 0'
  }

  if (!images || images.length === 0) {
    errors.images = 'Vui lòng tải ít nhất một ảnh'
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Có lỗi xảy ra',
      errors,
    })
  }

  const createdAt = new Date()
  const updatedAt = new Date()

  await dbRepository.beginTransaction()
  try {
    // Thêm sản phẩm vào bảng Products
    const productData = {
      name,
      description,
      notes,
      images: JSON.stringify(images),
      import_price,
      rental_price,
      category_id: category_id,
      status: 'available',
      created_at: createdAt,
      updated_at: updatedAt,
    }
    const response = await dbRepository.create('Products', productData) // Sử dụng hàm create từ repository

    const product = response.data
    const productId = product.id

    // Thêm các danh mục vào bảng ProductLibrary
    if (libraries && libraries.length > 0) {
      const productLibraries = libraries.map((libraryId) => [
        productId,
        libraryId,
      ])
      // Sử dụng hàm query để thêm các danh mục vào bảng trung gian
      await dbRepository.query(
        'INSERT INTO ProductLibrary (product_id, library_id) VALUES ?',
        [productLibraries]
      )
    }
    dbRepository.commitTransaction()
    // Trả về thành công
    successResponse(res, 'Sản phẩm đã được thêm thành công', product)
  } catch (error) {
    await dbRepository.rollbackTransaction()
    console.error('Lỗi khi thêm sản phẩm:', error)
    errorResponse(res, 'Lỗi khi thêm sản phẩm')
  }
}

// Cập nhật sản phẩm
exports.updateProduct = async (req, res) => {
  const { id } = req.params
  const {
    name,
    description,
    notes,
    libraries,
    category_id,
    images,
    import_price,
    rental_price,
  } = req.body

  try {
    // Bắt đầu transaction
    await dbRepository.beginTransaction()

    // Cập nhật sản phẩm
    await dbRepository.update('Products', id, {
      name,
      description,
      notes,
      images: JSON.stringify(images),
      import_price,
      rental_price,
      category_id,
      updated_at: new Date(),
    })

    // Xóa các danh mục cũ
    await dbRepository.remove('ProductLibrary', { product_id: id })

    // Thêm các danh mục mới vào bảng trung gian
    const productLibraries = libraries.map((libraryId) => [id, libraryId])
    if (productLibraries.length > 0) {
      await dbRepository.query(
        'INSERT INTO ProductLibrary (product_id, library_id) VALUES ?',
        [productLibraries]
      )
    }

    // Commit transaction nếu tất cả các bước trên thành công
    await dbRepository.commitTransaction()

    // Trả về thành công
    successResponse(res, 'Sản phẩm đã được cập nhật thành công')
  } catch (err) {
    // Nếu có lỗi, rollback lại transaction
    await dbRepository.rollbackTransaction()
    console.error('Lỗi khi cập nhật sản phẩm:', err)
    errorResponse(res, 'Lỗi khi cập nhật sản phẩm')
  }
}

// Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
  const { id } = req.params

  try {
    const variants = await dbRepository.where('Variants', { product_id: id })
    if (variants.data.length > 0) {
      return errorResponse(
        res,
        'Sản phẩm đã có các biến thể, vui lòng xóa các biến thể trước',
        400
      )
    }
    // Bắt đầu transaction
    await dbRepository.beginTransaction()

    // Xóa các liên kết của sản phẩm trong bảng trung gian
    await dbRepository.remove('ProductLibrary', { product_id: id })

    // Xóa sản phẩm trong bảng products
    await dbRepository.remove('Products', { id })

    // Commit transaction sau khi xóa thành công
    await dbRepository.commitTransaction()

    successResponse(res, 'Sản phẩm đã được xóa thành công')
  } catch (err) {
    // Nếu có lỗi, rollback transaction
    await dbRepository.rollbackTransaction()
    console.error('Lỗi khi xóa sản phẩm:', err)
    errorResponse(res, 'Lỗi khi xóa sản phẩm')
  }
}
