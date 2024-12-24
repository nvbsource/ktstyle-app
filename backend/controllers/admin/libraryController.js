const dbRepository = require('../../config/dbRepository') // Giả sử bạn có thư mục repository và đã tạo các hàm CRUD
const { successResponse, errorResponse } = require('../../helpers/responseHelper')

// Lấy tất cả các thư viện
exports.getAllLibraries = async (req, res) => {
  try {
    const libraries = await dbRepository.getAll('Library') // Dùng repository để lấy tất cả thư viện
    successResponse(res, 'Lấy danh sách thư viện thành công', libraries.data)
  } catch (error) {
    console.error('Lỗi khi lấy danh sách thư viện', error)
    errorResponse(res, 'Lỗi khi lấy danh sách thư viện')
  }
}

// Lấy thư viện theo ID
exports.getLibraryById = async (req, res) => {
  const { id } = req.params // Lấy ID từ request params

  try {
    const library = await dbRepository.getById('Library', id) // Dùng repository để lấy thư viện theo ID
    successResponse(res, 'Lấy thông tin thư viện thành công', library.data)
  } catch (error) {
    console.error('Lỗi khi lấy thư viện', err)
    errorResponse(res, 'Lỗi khi lấy thư viện')
  }
}

// Tạo mới thư viện
exports.createLibrary = async (req, res) => {
  const { name } = req.body // Lấy thông tin từ body request

  // Kiểm tra nếu thư viện đã tồn tại với tên này
  try {
    const existingLibrary = await dbRepository.where('Library', { name })
    if (existingLibrary.data.length > 0) {
      return errorResponse(res, 'Thư viện với tên này đã tồn tại', 400)
    }

    const libraryData = { name } // Tạo đối tượng dữ liệu thư viện mới
    const createdLibrary = await dbRepository.create('Library', libraryData) // Tạo thư viện mới
    successResponse(res, 'Tạo thư viện thành công', createdLibrary.data)
  } catch (error) {
    console.error('Lỗi khi tạo thư viện', err)
    errorResponse(res, 'Lỗi khi tạo thư viện')
  }
}

// Cập nhật thư viện
exports.updateLibrary = async (req, res) => {
  const { id } = req.params // Lấy ID từ request params
  const { name } = req.body // Lấy thông tin tên thư viện từ body request

  try {
    const updatedLibrary = await dbRepository.update('Library', id, { name }) // Cập nhật thông tin thư viện
    successResponse(res, 'Cập nhật thư viện thành công', updatedLibrary.data)
  } catch (error) {
    console.error('Lỗi khi cập nhật thư viện', error)
    errorResponse(res, 'Lỗi khi cập nhật thư viện')
  }
}

// Xóa thư viện
exports.deleteLibrary = async (req, res) => {
  const { id } = req.params // Lấy ID từ request params

  try {
    const productUses = await dbRepository.where('ProductLibrary', {
      library_id: id,
    })
    if (productUses.data.length > 0) {
      return errorResponse(
        res,
        'Thư viện này đang có sản phẩm không thể xoá',
        400
      )
    }
    const deletedLibrary = await dbRepository.remove('Library', { id }) // Xóa thư viện theo ID
    successResponse(res, 'Xóa thư viện thành công', deletedLibrary.data)
  } catch (error) {
    console.error('Lỗi khi xoá thư viện', err)
    errorResponse(res, 'Lỗi khi xoá thư viện')
  }
}
