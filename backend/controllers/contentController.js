const db = require('../config/db');
const { successResponse, errorResponse } = require('../helpers/responseHelper');

exports.getContents = (req, res) => {
    const { name, category, priceRange, startDate, endDate } = req.query;  // Lấy các bộ lọc từ query params

    let query = `
       SELECT 
            p.id AS product_id,
            p.name AS product_name,
            p.description AS product_description,
            p.note AS product_note,
            p.images AS product_images,
            p.import_price AS product_import_price,
            p.rental_price AS product_rental_price,
            p.created_at AS product_created_at,
            p.updated_at AS product_updated_at,
            pc.id AS content_id,
            pc.content AS content,
            pc.image_urls AS content_image_urls,
            pc.scheduled_at AS content_scheduled_at,
            pc.status AS content_status
        FROM contents pc
        LEFT JOIN products p ON pc.product_id = p.id
        WHERE 1=1;
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error("Lỗi khi lấy bài viết và sản phẩm:", err);
            return res.status(500).json({ message: "Lỗi khi lấy bài viết và sản phẩm" });
        }

        // Xử lý kết quả để mỗi bài viết có thông tin sản phẩm của nó
        const contents = results.map(row => ({
            id: row.content_id,
            content: row.content,
            image_urls: row.content_image_urls,
            scheduled_at: row.content_scheduled_at,
            status: row.content_status,
            product: row.product_id ? {
                id: row.product_id,
                name: row.product_name,
                description: row.product_description,
                note: row.product_note,
                images: row.product_images,
                import_price: row.product_import_price,
                rental_price: row.product_rental_price,
                created_at: row.product_created_at,
                updated_at: row.product_updated_at
            } : null
        }));

        res.status(200).json({
            message: "Danh sách bài viết và sản phẩm",
            data: contents
        });
    });
};

// API để tạo bài viết mới cho sản phẩm
exports.createProductContent = (req, res) => {
    const { product_id, content, image_urls, scheduled_at } = req.body;


    let errors = {};
    // Kiểm tra các trường
    if (!content || content.trim() === "") {
        errors.content = "Vui lòng nhập nội dung";
    }

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            status: "error",
            message: "Có lỗi xảy ra",
            errors
        });
    }

    // Thêm nội dung bài viết vào bảng `contents`
    const query = 'INSERT INTO contents (product_id, content, image_urls, scheduled_at) VALUES (?, ?, ?, ?)';
    db.query(query, [product_id, content, JSON.stringify(image_urls), scheduled_at], (err, result) => {
        if (err) {
            console.log(err);
            
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

    // Cập nhật nội dung bài viết trong bảng `contents`
    const query = 'UPDATE contents SET content = ?, image_urls = ?, scheduled_at = ?, status = ? WHERE id = ?';
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

    const query = 'SELECT * FROM contents WHERE product_id = ?';
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

    const query = 'DELETE FROM contents WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            return errorResponse(res, 'Lỗi khi xóa bài viết.');
        }
        successResponse(res, 'Bài viết đã được xóa thành công.');
    });
};
