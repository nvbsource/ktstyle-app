const db = require('../config/db');
const { successResponse, errorResponse } = require('../helpers/responseHelper');

// API để tạo bài viết mới cho sản phẩm
exports.createProductContent = (req, res) => {
    const { product_id, content, image_urls, scheduled_at } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!product_id || !content || !scheduled_at) {
        return errorResponse(res, 'Vui lòng cung cấp đầy đủ thông tin.', 400);
    }

    // Thêm nội dung bài viết vào bảng `product_contents`
    const query = 'INSERT INTO product_contents (product_id, content, image_urls, scheduled_at) VALUES (?, ?, ?, ?)';
    db.query(query, [product_id, content, JSON.stringify(image_urls), scheduled_at], (err, result) => {
        if (err) {
            return errorResponse(res, 'Lỗi khi tạo bài viết.');
        }
        successResponse(res, 'Bài viết đã được tạo thành công.');
    });
};

// API để chỉnh sửa bài viết cho sản phẩm
exports.updateProductContent = (req, res) => {
    const { id, content, image_urls, scheduled_at, status } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!content || !scheduled_at || !status) {
        return errorResponse(res, 'Vui lòng cung cấp đầy đủ thông tin.', 400);
    }

    // Cập nhật nội dung bài viết trong bảng `product_contents`
    const query = 'UPDATE product_contents SET content = ?, image_urls = ?, scheduled_at = ?, status = ? WHERE id = ?';
    db.query(query, [content, JSON.stringify(image_urls), scheduled_at, status, id], (err, result) => {
        if (err) {
            return errorResponse(res, 'Lỗi khi cập nhật bài viết.');
        }
        successResponse(res, 'Bài viết đã được cập nhật thành công.');
    });
};

// API để lấy danh sách bài viết của một sản phẩm
exports.getProductContents = (req, res) => {
    const { product_id } = req.params;

    const query = 'SELECT * FROM product_contents WHERE product_id = ?';
    db.query(query, [product_id], (err, results) => {
        if (err) {
            return errorResponse(res, 'Lỗi khi lấy danh sách bài viết.');
        }
        successResponse(res, "Lấy danh sách content thành công", results);
    });
};


// API để xóa bài viết
exports.deleteProductContent = (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM product_contents WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            return errorResponse(res, 'Lỗi khi xóa bài viết.');
        }
        successResponse(res, 'Bài viết đã được xóa thành công.');
    });
};
