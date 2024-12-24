const db = require('./db') // Kết nối tới MySQL

// Hàm bắt đầu transaction
const beginTransaction = () => {
  return new Promise((resolve, reject) => {
    db.beginTransaction((err) => {
      if (err) {
        reject(new Error('Lỗi khi bắt đầu transaction'))
      }
      resolve()
    })
  })
}

// Hàm commit transaction
const commitTransaction = () => {
  return new Promise((resolve, reject) => {
    db.commit((err) => {
      if (err) {
        reject(new Error('Lỗi khi commit transaction'))
      }
      resolve()
    })
  })
}

// Hàm rollback transaction
const rollbackTransaction = () => {
  return new Promise((resolve, reject) => {
    db.rollback(() => {
      resolve()
    })
  })
}

// Hàm lấy tất cả dữ liệu từ một bảng
const getAll = (table) => {
  const query = `SELECT * FROM ${table}`

  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) {
        console.error(`Lỗi khi lấy dữ liệu từ bảng ${table}:`, err)
        return reject(new Error(`Lỗi khi lấy dữ liệu từ bảng ${table}`))
      }
      resolve({
        status: true,
        message: `Lấy dữ liệu thành công từ bảng ${table}`,
        data: results,
      })
    })
  })
}

// * Thực hiện truy vấn SQL chung và trả về kết quả.
const query = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.query(query, params, (err, results) => {
      if (err) {
        console.error('Lỗi khi thực hiện truy vấn:', err)
        return reject(new Error('Lỗi khi thực hiện truy vấn'))
      } else {
        resolve({
          status: true,
          message: 'Truy vấn thành công',
          data: results,
        })
      }
    })
  })
}

// Hàm lấy dữ liệu theo ID
const getById = (table, id) => {
  const query = `SELECT * FROM ${table} WHERE id = ?`

  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, results) => {
      if (err) {
        console.error(`Lỗi khi lấy dữ liệu từ bảng ${table} với ID ${id}:`, err)
        return reject(
          new Error(`Lỗi khi lấy dữ liệu từ bảng ${table} với ID ${id}`)
        )
      }
      if (results.length === 0) {
        // Nếu không tìm thấy kết quả, trả về object error nhưng không ném lỗi
        return resolve({
          status: false,
          message: `${table} với ID ${id} không tồn tại`,
          data: null,
        })
      }
      resolve({
        status: true,
        message: `${table} với ID ${id} được tìm thấy`,
        data: results[0],
      })
    })
  })
}

// Hàm lọc dữ liệu chính xác với điều kiện
const where = (table, conditions, orderBy = null) => {
  return new Promise((resolve, reject) => {
    let query = `SELECT * FROM ${table} WHERE 1=1`
    const queryParams = []

    if (conditions) {
      Object.keys(conditions).forEach((key) => {
        query += ` AND ${key} = ?`
        queryParams.push(conditions[key]) // Đẩy giá trị vào mảng queryParams để bảo vệ khỏi SQL Injection
      })
    }

    if (orderBy) {
      query += ` ORDER BY ${orderBy}`
    }
    db.query(query, queryParams, (err, results) => {
      if (err) {
        console.error(`Lỗi khi lấy dữ liệu từ bảng ${table}:`, err)
        return reject(new Error(`Lỗi khi lấy dữ liệu từ bảng ${table}`))
      }
      resolve({
        status: true,
        message: `Lấy dữ liệu thành công từ bảng ${table}`,
        data: results,
        first: () => results[0],
      })
    })
  })
}

// Hàm lọc dữ liệu với các tham số tìm kiếm
const filter = (table, filters) => {
  let query = `SELECT * FROM ${table} WHERE 1=1`

  const queryParams = []
  if (filters) {
    Object.keys(filters).forEach((key) => {
      query += ` AND ${key} LIKE ?`
      queryParams.push(`%${filters[key]}%`)
    })
  }

  return new Promise((resolve, reject) => {
    db.query(query, queryParams, (err, results) => {
      if (err) {
        console.error(`Lỗi khi lọc dữ liệu từ bảng ${table}:`, err)
        return reject(new Error(`Lỗi khi lọc dữ liệu từ bảng ${table}`))
      }
      resolve({
        status: true,
        message: `Lọc dữ liệu thành công từ bảng ${table}`,
        data: results,
      })
    })
  })
}

// Hàm kiểm tra bản ghi có tồn tại hay không
const exists = (table, conditions) => {
  return new Promise((resolve, reject) => {
    let query = `SELECT COUNT(*) as count FROM ${table} WHERE 1=1`
    const queryParams = []

    // Thêm điều kiện vào câu truy vấn
    if (conditions) {
      Object.keys(conditions).forEach((key) => {
        query += ` AND ${key} = ?`
        queryParams.push(conditions[key])
      })
    }

    db.query(query, queryParams, (err, results) => {
      if (err) {
        console.error(`Lỗi khi kiểm tra dữ liệu từ bảng ${table}:`, err)
        return reject(new Error(`Lỗi khi kiểm tra dữ liệu từ bảng ${table}`))
      }

      // Kiểm tra kết quả, nếu count > 0 thì bản ghi tồn tại
      resolve(results[0].count > 0)
    })
  })
}

// Hàm thêm mới dữ liệu
const create = (table, data) => {
  const query = `INSERT INTO ${table} SET ?`

  return new Promise((resolve, reject) => {
    db.query(query, data, (err, result) => {
      if (err) {
        console.error(`Lỗi khi thêm dữ liệu vào bảng ${table}:`, err)
        return reject(new Error(`Lỗi khi thêm dữ liệu vào bảng ${table}`))
      }
      resolve({
        status: true,
        message: `${table} đã được thêm thành công`,
        data: { id: result.insertId, ...data },
      })
    })
  })
}

// Hàm cập nhật dữ liệu
const update = (table, id, data) => {
  const query = `UPDATE ${table} SET ? WHERE id = ?`

  return new Promise((resolve, reject) => {
    db.query(query, [data, id], (err, result) => {
      if (err) {
        console.error(`Lỗi khi cập nhật dữ liệu vào bảng ${table}:`, err)
        return reject(new Error(`Lỗi khi cập nhật dữ liệu vào bảng ${table}`))
      }
      if (result.affectedRows === 0) {
        return resolve({
          status: false,
          message: `${table} với ID ${id} không tồn tại`,
          data: null,
        })
      }
      resolve({
        status: true,
        message: `${table} đã được cập nhật thành công`,
        data: result,
      })
    })
  })
}

// Hàm xóa dữ liệu
const remove = (table, conditions) => {
  let query = `DELETE FROM ${table} WHERE 1=1`
  const queryParams = []

  // Xử lý điều kiện
  if (conditions) {
    Object.keys(conditions).forEach((key) => {
      query += ` AND ${key} = ?`
      queryParams.push(conditions[key])
    })
  }

  return new Promise((resolve, reject) => {
    db.query(query, queryParams, (err, result) => {
      if (err) {
        console.error(`Lỗi khi xóa dữ liệu từ bảng ${table}:`, err)
        reject(new Error(`Lỗi khi xóa dữ liệu từ bảng ${table}`))
      }
      resolve({ status: true, message: 'Xoá dữ liệu thành công', data: result })
    })
  })
}

module.exports = {
  beginTransaction,
  commitTransaction,
  rollbackTransaction,
  getAll,
  getById,
  query,
  where,
  filter,
  create,
  update,
  remove,
  exists,
}
