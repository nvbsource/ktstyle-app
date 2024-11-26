const dbRepository = require('../config/dbRepository');  // Kết nối tới repository
const { errorResponse, successResponse } = require('../helpers/responseHelper');

// Thêm sản phẩm vào kho (Nhập kho)
exports.addInventory = async (req, res) => {
    const { product_id, size, color, quantity } = req.body;

    // Kiểm tra điều kiện đầu vào
    if (!product_id || !size || !color || !quantity || quantity <= 0) {
        return errorResponse(res, 'Thông tin không hợp lệ (product_id, size, color và quantity là bắt buộc)', 400);
    }

    try {
        const product = await dbRepository.getById('Products', product_id); // Kiểm tra xem sản phẩm có tồn tại không
        if (!product.data.status) {
            return errorResponse(res, "Sản phẩm không tồn tại", 404)
        }

        const productExistInventory = await dbRepository.where('Inventory', { product_id }); // Kiểm tra xem sản phẩm có tồn tại không
        if (!productExistInventory.data.status) {
            return errorResponse(res, "Sản phẩm đã tồn tại trong kho", 400)
        }

        // Thêm sản phẩm vào kho
        const inventoryData = { product_id, size, color, quantity, status: 'available' };
        const result = await dbRepository.create('Inventory', inventoryData);

        return successResponse(res, 'Sản phẩm đã được thêm vào kho', result.data)
    } catch (error) {
        console.error("Lỗi khi tạo kho:", err);
        errorResponse(res, "Lỗi khi tạo kho");
    }
};

// Cập nhật số lượng sản phẩm trong kho (sau khi cho thuê hoặc nhập kho thêm)
exports.updateInventoryQuantity = async (req, res) => {
    const { id, quantity, action } = req.body;

    // Kiểm tra đầu vào
    if (!id || quantity <= 0 || !action || !['add', 'remove'].includes(action)) {
        return errorResponse(res, 'Thông tin không hợp lệ (id, quantity và action là bắt buộc)', 400);

    }

    try {
        const response = await dbRepository.getById('Inventory', id); // Kiểm tra tồn tại sản phẩm trong kho
        if (!inventory.data.status) {
            return errorResponse(res, 'Kho hàng không tồn tại vui lòng load trang lại', 404);
        }

        const inventory = response.data;
        let newQuantity;
        if (action === 'add') {
            newQuantity = inventory.quantity + quantity; // Tăng số lượng
        } else if (action === 'remove') {
            if (inventory.quantity < quantity) {
                return errorResponse(res, 'Số lượng không đủ để giảm', 400);
            }
            newQuantity = inventory.quantity - quantity; // Giảm số lượng
        }

        const updatedData = { quantity: newQuantity, updated_at: new Date() };
        await dbRepository.update('Inventory', id, updatedData); // Cập nhật lại số lượng

        return successResponse(res, 'Số lượng sản phẩm trong kho đã được cập nhật');
    } catch (error) {
        console.error("Lỗi khi cập nhật kho:", err);
        errorResponse(res, "Lỗi khi cập nhật kho");
    }
};

// Lấy danh sách sản phẩm trong kho
exports.getInventory = async (req, res) => {
    const { product_id, size, color, status } = req.query;

    const conditions = {};
    if (product_id) conditions.product_id = product_id;
    if (size) conditions.size = size;
    if (color) conditions.color = color;
    if (status) conditions.status = status;

    try {
        const inventory = await dbRepository.where('Inventory', conditions);
        return successResponse(res, 'Lấy danh sách kho thành công', inventory.data);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách kho:", err);
        errorResponse(res, "Lỗi khi lấy danh sách kho");
    }
};

// Cập nhật trạng thái sản phẩm trong kho (Ví dụ: đang cho thuê, sẵn có)
exports.updateInventoryStatus = async (req, res) => {
    const { id, status } = req.body;

    // Kiểm tra trạng thái hợp lệ
    if (!id || !status || !['available', 'rented'].includes(status)) {
        return errorResponse(res, 'Thông tin không hợp lệ (id và status là bắt buộc và status phải là "available" hoặc "rented")', 400);
    }

    try {
        const inventory = await dbRepository.getById('Inventory', id); // Kiểm tra sản phẩm tồn tại
        if (!inventory.data.status) {
            return errorResponse(res, 'Kho hàng không tồn tại vui lòng load trang lại', 404);
        }

        // Cập nhật trạng thái sản phẩm
        const updatedData = { status, updated_at: new Date() };
        await dbRepository.update('Inventory', id, updatedData);

        return successResponse(res, 'Trạng thái sản phẩm đã được cập nhật');
    } catch (error) {
        console.error("Lỗi khi cập nhật kho:", err);
        errorResponse(res, "Lỗi khi cập nhật kho");
    }
};

// Xóa sản phẩm khỏi kho
exports.deleteInventory = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return errorResponse(res, 'ID sản phẩm kho không được để trống', 400);
    }

    try {
        const inventory = await dbRepository.getById('Inventory', id); // Kiểm tra sản phẩm tồn tại
        if (!inventory.data.status) {
            return errorResponse(res, 'Kho hàng không tồn tại vui lòng load trang lại', 404);
        }

        const rental = await dbRepository.where('Rentals', { inventory_id, id }); // Kiểm tra sản phẩm tồn tại
        if (!rental.data.status) {
            return errorResponse(res, 'Không thể xoá kho hàng khi có đã thuê sản phẩm này', 400);
        }
        // Xóa sản phẩm khỏi kho
        await dbRepository.remove('Inventory', { id });

        return successResponse(res, 'Sản phẩm đã được xóa khỏi kho');
    } catch (error) {
        console.error("Lỗi khi xoá kho:", err);
        errorResponse(res, "Lỗi khi xoá kho");
    }
};
