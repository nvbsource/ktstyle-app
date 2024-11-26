const dbRepository = require('../config/dbRepository');
const { successResponse, errorResponse } = require('../helpers/responseHelper');

// Lấy tất cả khách hàng với cha-con
exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await dbRepository.getAll("Customers");

        // Trả về khách hàng cha và cây đầy đủ
        successResponse(res, "Lấy danh sách khách hàng thành công", customers.data);
    } catch (err) {
        console.error("Lỗi khi lấy danh sách khách hàng:", err);
        errorResponse(res, "Lỗi khi danh sách lấy khách hàng");
    }
};

// Cập nhật thông tin khách hàng
exports.updateCustomer = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const customer = await dbRepository.getById('Customers', id);

        if (!customer.status) {
            return errorResponse(res, 'Khách hàng chỉnh sửa không tồn tại', 404);
        }

        // Cập nhật khách hàng
        await dbRepository.update('Customers', id, { name });
        successResponse(res, 'Khách hàng đã được cập nhật thành công');
    } catch (err) {
        console.error("Lỗi khi cập nhật khách hàng:", err);
        errorResponse(res, "Lỗi khi cập nhật khách hàng");
    }
};
