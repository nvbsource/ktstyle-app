import { api } from "./api";

// Lấy tất cả khách hàng
export const fetchCustomers = async () => {
    try {
        const response = await api.get('/customers');
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách khách hàng:", error);
        throw error;
    }
};

// Thêm khách hàng mới
export const addCustomer = async (customer) => {
    try {
        const response = await api.post('/customers', customer);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi thêm khách hàng:", error);
        throw error;
    }
};

// Cập nhật khách hàng
export const updateCustomer = async (id, customer) => {
    try {
        const response = await api.put(`/customers/${id}`, customer);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi cập nhật khách hàng:", error);
        throw error;
    }
};

export const deleteCustomer = async (id) => {
    try {
        const response = await api.delete(`/customers/${id}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi xóa khách hàng:", error);
        throw error;
    }
};