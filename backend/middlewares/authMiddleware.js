const jwt = require('jsonwebtoken');
const { errorResponse } = require('../helpers/responseHelper');

const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret"; // Thay thế bằng secret thực tế
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Không có token. Truy cập bị từ chối!" });
  }

  // Token có dạng "Bearer <token>"
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token không hợp lệ!" });
  }

  try {
    // Xác minh token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Lưu thông tin người dùng vào req.user để sử dụng trong các route sau
    req.user = decoded;

    next(); // Tiếp tục xử lý route
  } catch (error) {
    return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
  }
};

module.exports = verifyToken;