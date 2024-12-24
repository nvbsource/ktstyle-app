const db = require('../../config/db')
const { successResponse, errorResponse } = require('../../helpers/responseHelper')

// Lấy tất cả chủ đề
exports.getTopics = (req, res) => {
  const { search } = req.query // Lấy từ khóa tìm kiếm từ query params

  let query = 'SELECT * FROM topics'

  // Nếu có từ khóa tìm kiếm, thêm điều kiện LIKE vào câu truy vấn
  if (search) {
    query += ` WHERE name LIKE '%${search}'` // Tìm kiếm theo tên chủ đề
  }

  query += ` ORDER BY id DESC`

  db.query(query, (err, results) => {
    if (err) {
      console.error('Lỗi khi lấy chủ đề:', err)
      return errorResponse(res, 'Lỗi khi lấy chủ đề')
    }

    successResponse(res, 'Chủ đề đã được lấy thành công', results)
  })
}

// Thêm chủ đề mới
exports.addTopic = (req, res) => {
  const { name } = req.body
  db.query('INSERT INTO topics SET ?', { name }, (err, result) => {
    if (err) {
      console.error('Lỗi khi thêm chủ đề:', err)
      return errorResponse(res, 'Lỗi khi thêm chủ đề')
    }
    console.log(result)

    successResponse(res, 'Chủ đề đã được thêm thành công', {
      id: result.insertId,
      name,
    })
  })
}

// Cập nhật chủ đề
exports.updateTopic = (req, res) => {
  const { id } = req.params
  const { name } = req.body
  db.query(
    'UPDATE topics SET ? WHERE id = ?',
    [{ name }, id],
    (err, result) => {
      if (err) {
        console.error('Lỗi khi cập nhật chủ đề:', err)
        return errorResponse(res, 'Lỗi khi cập nhật chủ đề')
      }
      if (result.affectedRows === 0) {
        return errorResponse(res, 'Không tìm thấy chủ đề để cập nhật', 404)
      }
      successResponse(res, 'Chủ đề đã được cập nhật thành công')
    }
  )
}

// Xóa chủ đề với ràng buộc kiểm tra liên kết sản phẩm
exports.deleteTopic = (req, res) => {
  const { id } = req.params

  // Kiểm tra xem chủ đề có liên kết với sản phẩm nào không
  db.query(
    'SELECT COUNT(*) AS count FROM product_contents WHERE topic_id = ?',
    [id],
    (err, results) => {
      if (err) {
        console.error('Lỗi khi kiểm tra liên kết nội dung:', err)
        return errorResponse(res, 'Lỗi khi kiểm tra liên kết nội dung')
      }

      if (results[0].count > 0) {
        return errorResponse(
          res,
          'Không thể xóa chủ đề vì có nội dung liên kết',
          400
        )
      }

      // Nếu không có sản phẩm liên kết, thực hiện xóa chủ đề
      db.query('DELETE FROM topics WHERE id = ?', [id], (err, result) => {
        if (err) {
          console.error('Lỗi khi xóa chủ đề:', err)
          return errorResponse(res, 'Lỗi khi xóa chủ đề')
        }
        if (result.affectedRows === 0) {
          return errorResponse(res, 'Không tìm thấy chủ đề để xóa', 404)
        }
        successResponse(res, 'Chủ đề đã được xóa thành công')
      })
    }
  )
}
