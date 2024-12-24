const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret"; // Đảm bảo bạn dùng biến môi trường trong sản xuất
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h"; // Thời gian hết hạn mặc định (1 giờ)

/**
 * Tạo JWT token
 * @param {Object} payload - Dữ liệu muốn mã hóa trong token
 * @param {String} [expiresIn] - Thời gian hết hạn của token (nếu không truyền sẽ dùng mặc định)
 * @returns {String} - Token đã mã hóa
 */
const generateToken = (payload, expiresIn = JWT_EXPIRES_IN) => {
  try {
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn });
    return token;
  } catch (error) {
    console.error("Lỗi khi tạo JWT:", error.message);
    throw new Error("Không thể tạo JWT token");
  }
};

/**
 * Xác minh JWT token
 * @param {String} token - Token cần xác minh
 * @returns {Object} - Payload đã giải mã nếu token hợp lệ
 */
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error("Lỗi khi xác minh JWT:", error.message);
    throw new Error("Token không hợp lệ hoặc đã hết hạn");
  }
};

/**
 * Giải mã JWT token mà không xác minh (chỉ lấy payload)
 * @param {String} token - Token cần giải mã
 * @returns {Object} - Payload đã giải mã
 */
const decodeToken = (token) => {
  try {
    const decoded = jwt.decode(token, { complete: true });
    return decoded; // Trả về cả phần header và payload
  } catch (error) {
    console.error("Lỗi khi giải mã JWT:", error.message);
    throw new Error("Không thể giải mã JWT token");
  }
};

module.exports = {
  generateToken,
  verifyToken,
  decodeToken,
};