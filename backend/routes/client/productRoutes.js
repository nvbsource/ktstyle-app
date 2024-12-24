const express = require('express')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const { generateToken } = require('../../helpers/jwtHelpers')
const db = require('../../config/dbRepository')
const verifyToken = require('../../middlewares/authMiddleware')
const {
  successResponse,
  errorResponse,
} = require('../../helpers/responseHelper')

const router = express.Router()

router.get('/', async (req, res) => {
  const { id, type, name, library, category, priceRange, startDate, endDate } =
    req.query // Lấy các bộ lọc từ query params

  let queryStr = `
        SELECT p.id, p.name, p.description, p.notes, p.images, p.thumbnail, p.slug, p.import_price, p.rental_price,
               GROUP_CONCAT(DISTINCT l.id) AS library_ids, 
               GROUP_CONCAT(DISTINCT l.name) AS library_names, 
               c.id as category_id, 
               c.name as category_name, 
               p.status, 
               p.created_at, 
               p.updated_at,
               GROUP_CONCAT(DISTINCT v.id) AS variant_ids,
               GROUP_CONCAT(DISTINCT v.color) AS variant_colors,
               GROUP_CONCAT(DISTINCT v.size) AS variant_sizes
        FROM Products p
        LEFT JOIN Categories c ON p.category_id = c.id
        LEFT JOIN ProductLibrary pl ON p.id = pl.product_id
        LEFT JOIN Library l ON pl.library_id = l.id
        LEFT JOIN Variants v ON p.id = v.product_id
        WHERE 1=1
    `

  // Thêm bộ lọc theo tên sản phẩm (nếu có)
  const queryParams = []

  if (type === 'accessory') {
    queryStr += ` AND p.item_type = 'accessory'`
  } else {
    queryStr += ` AND p.item_type = 'product'`
  }

  if (id) {
    queryStr += ` AND p.id = ?`
    queryParams.push(`${id}`)
  }

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
    const results = await db.query(queryStr, queryParams)

    // Xử lý kết quả để xây dựng danh sách sản phẩm với tất cả các thư viện
    let products = results.data.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      thumbnail: row.thumbnail,
      slug: row.slug,
      images: row.images,
      rental_price: row.rental_price,
      libraries: row.library_ids
        ? row.library_ids.split(',').map((id, index) => ({
            id: parseInt(id),
            name: row.library_names.split(',')[index],
          }))
        : [],
      variants: row.variant_ids
        ? row.variant_ids.split(',').map((id, index) => ({
            id: parseInt(id),
            color: row.variant_colors.split(',')[index],
            size: row.variant_sizes.split(',')[index],
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

    // Trả về dữ liệu sản phẩm
    successResponse(res, 'Danh sách sản phẩm đã được lấy thành công', products)
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sản phẩm:', error)
    errorResponse(res, 'Lỗi khi lấy danh sách sản phẩm')
  }
})
module.exports = router
