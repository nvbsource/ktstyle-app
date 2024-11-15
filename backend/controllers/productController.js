const db = require('../config/db');
const { successResponse, errorResponse } = require('../helpers/responseHelper');

// Lấy danh sách sản phẩm
exports.getProducts = (req, res) => {
    const { name, category, priceRange, startDate, endDate } = req.query;  // Lấy các bộ lọc từ query params

    let query = `
        SELECT p.id, p.name, p.description, p.note, p.images, p.import_price, p.rental_price,
               GROUP_CONCAT(DISTINCT c.id) AS category_ids, GROUP_CONCAT(DISTINCT c.name) AS category_names, p.created_at, p.updated_at
        FROM products p
        LEFT JOIN product_categories pc ON p.id = pc.product_id
        LEFT JOIN categories c ON pc.category_id = c.id
        WHERE 1=1
    `;

    // Thêm bộ lọc theo tên sản phẩm (nếu có)
    if (name) {
        query += ` AND p.name LIKE '%${name}%'`;
    }

    // Thêm bộ lọc theo giá (nếu có)
    if (priceRange) {
        // Kiểm tra nếu priceRange có đúng định dạng "min,max"
        const priceParts = priceRange.split(',');

        // Kiểm tra xem có đúng 2 phần không và các phần có phải là số hợp lệ không
        if (priceParts.length === 2 && !isNaN(priceParts[0]) && !isNaN(priceParts[1])) {
            const minPrice = Number(priceParts[0]);
            const maxPrice = Number(priceParts[1]);

            // Kiểm tra thêm nếu minPrice < maxPrice
            if (minPrice <= maxPrice) {
                query += ` AND p.import_price BETWEEN ${minPrice} AND ${maxPrice}`;
            } else {
                return errorResponse(res, "Giá nhập phải nhỏ hơn hoặc bằng giá thuê");
            }
        } else {
            return errorResponse(res, "Giá nhập không hợp lệ. Định dạng đúng là minPrice,maxPrice.");
        }
    }

    // Thêm bộ lọc theo ngày (nếu có)
    if (startDate && endDate) {
        query += ` AND DATE(p.created_at) BETWEEN '${startDate}' AND '${endDate}'`;
    }

    query += ` GROUP BY p.id`;
    query += ` ORDER BY p.id DESC`;

    // Thực hiện truy vấn
    db.query(query, (err, results) => {

        if (err) {
            console.error("Lỗi khi lấy danh sách sản phẩm:", err);
            return errorResponse(res, "Lỗi khi lấy danh sách sản phẩm");
        }

        // Xử lý kết quả để xây dựng danh sách sản phẩm với tất cả các danh mục
        let products = results.map(row => ({
            id: row.id,
            name: row.name,
            description: row.description,
            note: row.note,
            images: row.images,
            import_price: row.import_price,
            rental_price: row.rental_price,
            categories: row.category_ids ? row.category_ids.split(',').map((id, index) => ({
                id: parseInt(id),
                name: row.category_names.split(',')[index]
            })) : []  // Kết hợp danh mục từ `GROUP_CONCAT`
        }));

        if (category) {
            products = products.filter(product => product.categories.some(categoryObj => categoryObj.id == category));
        }

        // Trả về dữ liệu sản phẩm
        res.json({
            message: "Danh sách sản phẩm đã được lấy thành công",
            data: products,
        });
    });
};




// Thêm sản phẩm mới
exports.addProduct = (req, res) => {
    const { name, description, note, categories, images, import_price, rental_price } = req.body;
    let errors = {};
    // Kiểm tra các trường
    if (!name || name.trim() === "") {
        errors.name = "Vui lòng nhập tên sản phẩm";
    }

    if (!description || description.trim() === "") {
        errors.description = "Vui lòng nhập mô tả sản phẩm";
    }

    if (!import_price || isNaN(import_price) || import_price < 0) {
        errors.import_price = "Giá nhập phải là một số và lớn hơn hoặc bằng 0";
    }

    if (!rental_price || isNaN(rental_price) || rental_price < 0) {
        errors.rental_price = "Giá cho thuê phải là một số và lớn hơn hoặc bằng 0";
    }

    if (!images || images.length === 0) {
        errors.images = "Vui lòng tải ít nhất một ảnh";
    }

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            status: "error",
            message: "Có lỗi xảy ra",
            errors
        });
    }

    const createdAt = new Date();
    const updatedAt = new Date();

    db.query('INSERT INTO products SET ?', {
        name, description, note, images: JSON.stringify(images), import_price, rental_price, created_at: createdAt, updated_at: updatedAt
    }, (err, result) => {
        if (err) {
            return errorResponse(res, "Lỗi khi thêm sản phẩm");
        }

        const productId = result.insertId;

        // Thêm các danh mục vào bảng trung gian
        const productCategories = categories?.map((categoryId) => [productId, categoryId]) || [];
        if (productCategories.length > 0) {
            db.query('INSERT INTO product_categories (product_id, category_id) VALUES ?', [productCategories], (err) => {
                if (err) {
                    return errorResponse(res, "Lỗi khi thêm danh mục cho sản phẩm");
                }
            });
        }

        successResponse(res, "Sản phẩm đã được thêm thành công");
    });
};

// Cập nhật sản phẩm
exports.updateProduct = (req, res) => {
    const { id } = req.params;
    const { name, description, note, categories, images, import_price, rental_price } = req.body;

    db.beginTransaction((err) => {
        if (err) {
            console.error("Lỗi khi bắt đầu transaction:", err);
            return errorResponse(res, "Lỗi khi bắt đầu transaction");
        }

        // Thực hiện cập nhật sản phẩm
        db.query('UPDATE products SET ? WHERE id = ?', [{
            name,
            description,
            note,
            images: JSON.stringify(images),
            import_price,
            rental_price,
            updated_at: new Date()
        }, id], (err, result) => {
            if (err) {
                console.error("Lỗi khi cập nhật sản phẩm:", err);
                return db.rollback(() => {
                    errorResponse(res, "Lỗi khi cập nhật sản phẩm");
                });
            }

            // Xóa các danh mục cũ trong bảng trung gian
            db.query('DELETE FROM product_categories WHERE product_id = ?', [id], (err) => {
                if (err) {
                    console.error("Lỗi khi xóa danh mục cũ:", err);
                    return db.rollback(() => {
                        errorResponse(res, "Lỗi khi xóa danh mục cũ");
                    });
                }

                // Thêm các danh mục mới vào bảng trung gian
                const productCategories = categories.map((categoryId) => [id, categoryId]);
                if (productCategories.length > 0) {
                    db.query('INSERT INTO product_categories (product_id, category_id) VALUES ?', [productCategories], (err) => {
                        if (err) {
                            console.error("Lỗi khi thêm danh mục mới:", err);
                            return db.rollback(() => {
                                errorResponse(res, "Lỗi khi thêm danh mục mới");
                            });
                        }

                        // Nếu mọi thứ đều thành công, commit transaction
                        db.commit((err) => {
                            if (err) {
                                console.error("Lỗi khi commit transaction:", err);
                                return db.rollback(() => {
                                    errorResponse(res, "Lỗi khi commit transaction");
                                });
                            }

                            // Trả về thành công sau khi commit
                            successResponse(res, "Sản phẩm đã được cập nhật thành công với các danh mục mới");
                        });
                    });
                } else {
                    // Nếu không có danh mục mới, commit transaction
                    db.commit((err) => {
                        if (err) {
                            console.error("Lỗi khi commit transaction:", err);
                            return db.rollback(() => {
                                errorResponse(res, "Lỗi khi commit transaction");
                            });
                        }

                        // Trả về thành công sau khi commit
                        successResponse(res, "Sản phẩm đã được cập nhật thành công");
                    });
                }
            });
        });
    });

};

// Xóa sản phẩm
exports.deleteProduct = (req, res) => {
    const { id } = req.params;

    // Xóa các liên kết của sản phẩm trong bảng trung gian trước
    db.query('DELETE FROM product_categories WHERE product_id = ?', [id], (err) => {
        if (err) {
            console.error("Lỗi khi xóa liên kết sản phẩm trong bảng trung gian:", err);
            return errorResponse(res, "Lỗi khi xóa liên kết sản phẩm");
        }

        // Sau khi xóa liên kết, xóa sản phẩm trong bảng products
        db.query('DELETE FROM products WHERE id = ?', [id], (err) => {
            if (err) {
                console.error("Lỗi khi xóa sản phẩm:", err);
                return errorResponse(res, "Lỗi khi xóa sản phẩm");
            }
            successResponse(res, "Sản phẩm đã được xóa thành công");
        });
    });
};
