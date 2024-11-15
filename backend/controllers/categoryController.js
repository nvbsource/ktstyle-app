const db = require('../config/db');
const { successResponse, errorResponse } = require('../helpers/responseHelper');

// Lấy tất cả danh mục
exports.getCategories = (req, res) => {
    db.query('SELECT * FROM categories', (err, results) => {
        if (err) {
            console.error("Lỗi khi lấy danh mục:", err);
            return errorResponse(res, "Lỗi khi lấy danh mục");
        }
        successResponse(res, "Danh mục đã được lấy thành công", results);
    });
};

// Thêm danh mục mới
exports.addCategory = (req, res) => {
    const { name } = req.body;
    db.query('INSERT INTO categories SET ?', { name }, (err) => {
        if (err) {
            console.error("Lỗi khi thêm danh mục:", err);
            return errorResponse(res, "Lỗi khi thêm danh mục");
        }
        successResponse(res, "Danh mục đã được thêm thành công");
    });
};

// Cập nhật danh mục
exports.updateCategory = (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    db.query('UPDATE categories SET ? WHERE id = ?', [{ name }, id], (err, result) => {
        if (err) {
            console.error("Lỗi khi cập nhật danh mục:", err);
            return errorResponse(res, "Lỗi khi cập nhật danh mục");
        }
        if (result.affectedRows === 0) {
            return errorResponse(res, "Không tìm thấy danh mục để cập nhật", 404);
        }
        successResponse(res, "Danh mục đã được cập nhật thành công");
    });
};

// Xóa danh mục với ràng buộc kiểm tra liên kết sản phẩm
exports.deleteCategory = (req, res) => {
    const { id } = req.params;

    // Kiểm tra xem danh mục có liên kết với sản phẩm nào không
    db.query('SELECT COUNT(*) AS count FROM product_categories WHERE category_id = ?', [id], (err, results) => {
        if (err) {
            console.error("Lỗi khi kiểm tra liên kết sản phẩm:", err);
            return errorResponse(res, "Lỗi khi kiểm tra liên kết sản phẩm");
        }

        if (results[0].count > 0) {
            return errorResponse(res, "Không thể xóa danh mục vì có sản phẩm liên kết", 400);
        }

        // Nếu không có sản phẩm liên kết, thực hiện xóa danh mục
        db.query('DELETE FROM categories WHERE id = ?', [id], (err, result) => {
            if (err) {
                console.error("Lỗi khi xóa danh mục:", err);
                return errorResponse(res, "Lỗi khi xóa danh mục");
            }
            if (result.affectedRows === 0) {
                return errorResponse(res, "Không tìm thấy danh mục để xóa", 404);
            }
            successResponse(res, "Danh mục đã được xóa thành công");
        });
    });
};
