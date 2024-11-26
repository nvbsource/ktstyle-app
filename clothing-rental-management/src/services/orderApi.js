import { api } from "./api";

// Lấy tất cả hoá đơn
export const fetchOrders = async () => {
    try {
        const response = await api.get('/orders');
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách hoá đơn:", error);
        throw error;
    }
};