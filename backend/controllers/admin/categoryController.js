const dbRepository = require('../../config/dbRepository')
const {
  successResponse,
  errorResponse,
} = require('../../helpers/responseHelper')

// Lấy tất cả danh mục với cha-con
exports.getCategories = async (req, res) => {
  const { type } = req.params
  if (type !== 'accessory' && type !== 'product') {
    return res.status(400).json({
      status: 'error',
      message: 'Loại danh mục không hợp lệ',
    })
  }

  try {
    const categories = await dbRepository.getAll('Categories')

    // Hàm đệ quy để xây dựng cây danh mục
    const buildCategoryTree = (categories, parentId = null) => {
      return categories
        .filter(
          (category) =>
            category.parent_id === parentId && category.item_type === type
        ) // Lọc các danh mục con của parentId
        .map((category) => ({
          ...category,
          children: buildCategoryTree(categories, category.id), // Đệ quy tìm các con
        }))
    }

    // Xây dựng cây danh mục từ root (parent_id === null)
    const categoryTree = buildCategoryTree(categories.data)

    // Trả về danh mục cha và cây đầy đủ
    successResponse(
      res,
      'Danh mục cha và con đã được lấy thành công',
      categoryTree
    )
  } catch (err) {
    console.error('Lỗi khi lấy danh mục:', err)
    errorResponse(res, 'Lỗi khi lấy danh mục')
  }
}
// Thêm danh mục mới
exports.addCategory = async (req, res) => {
  const { name, parent_id, item_type } = req.body

  try {
    if (item_type !== 'accessory' && item_type !== 'product') {
      return res.status(400).json({
        status: 'error',
        message: 'Loại sản phẩm không hợp lệ',
      })
    }

    // Kiểm tra nếu tên danh mục đã tồn tại
    const existingCategory = await dbRepository.where('Categories', {
      name,
      item_type,
      parent_id: parent_id || null,
    })
    if (existingCategory.data.length > 0) {
      return errorResponse(res, 'Danh mục với tên này đã tồn tại', 400)
    }

    // Thêm danh mục mới
    const newCategory = await dbRepository.create('Categories', {
      name,
      parent_id: parent_id || null,
      item_type,
    })
    successResponse(res, 'Danh mục đã được thêm thành công', newCategory)
  } catch (err) {
    console.error('Lỗi khi thêm danh mục:', err)
    errorResponse(res, 'Lỗi khi thêm danh mục')
  }
}

// Cập nhật thông tin danh mục
exports.updateCategory = async (req, res) => {
  const { id } = req.params
  const { name, parent_id, item_type } = req.body

  try {
    if (item_type !== 'accessory' && item_type !== 'product') {
      return res.status(400).json({
        status: 'error',
        message: 'Loại sản phẩm không hợp lệ',
      })
    }

    const category = await dbRepository.getById('Categories', id)

    if (!category.status) {
      return errorResponse(res, 'Danh mục chỉnh sửa không tồn tại', 404)
    }

    if (
      parent_id &&
      !(await dbRepository.where('Categories', { parent_id, item_type })).status
    ) {
      return errorResponse(res, 'Danh mục cha không tồn tại', 404)
    }

    // Kiểm tra nếu tên danh mục mới đã tồn tại
    const existingCategory = (
      await dbRepository.where('Categories', {
        name,
        parent_id: parent_id || null,
        item_type,
      })
    ).first()

    if (existingCategory && existingCategory.id !== id) {
      return errorResponse(res, 'Danh mục với tên này đã tồn tại', 400)
    }

    // Cập nhật danh mục
    await dbRepository.update('Categories', id, {
      name,
      parent_id: parent_id || null,
    })
    successResponse(res, 'Danh mục đã được cập nhật thành công')
  } catch (err) {
    console.error('Lỗi khi cập nhật danh mục:', err)
    errorResponse(res, 'Lỗi khi cập nhật danh mục')
  }
}

// Xoá danh mục
exports.deleteCategory = async (req, res) => {
  const { id } = req.params

  try {
    // Kiểm tra xem danh mục có con không
    const subCategories = await dbRepository.where('Categories', {
      parent_id: id,
    })
    if (subCategories.data.length > 0) {
      return errorResponse(
        res,
        'Danh mục này có danh mục con, bạn không thể xoá',
        400
      )
    }

    const products = await dbRepository.where('Products', { category_id: id })
    if (products.data.length > 0) {
      return errorResponse(
        res,
        'Danh mục này đang có sản phẩm, bạn không thể xoá',
        400
      )
    }

    // Xoá danh mục
    await dbRepository.remove('Categories', { id })
    successResponse(res, 'Danh mục đã được xoá thành công')
  } catch (err) {
    console.error('Lỗi khi xoá danh mục:', err)
    errorResponse(res, 'Lỗi khi xoá danh mục')
  }
}
