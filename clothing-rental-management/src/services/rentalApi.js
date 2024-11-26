import { api } from "./api";

// Lấy tất cả cho thuê
export const fetchRentals = async () => {
    try {
        const response = await api.get('/rentals');
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách cho thuê:", error);
        throw error;
    }
};