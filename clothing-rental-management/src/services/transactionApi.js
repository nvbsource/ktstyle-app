import { api } from "./api";

// Lấy tất cả giao dịch
export const fetchTransactions = async () => {
    try {
        const response = await api.get('/transactions');
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách giao dịch:", error);
        throw error;
    }
};