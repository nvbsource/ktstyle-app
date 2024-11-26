import { api } from "./api";

// Lấy tất cả danh mục
export const fetchCategories = async () => {
    try {
        const response = await api.get('/categories');
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách danh mục:", error);
        throw error;
    }
};

// Thêm danh mục mới
export const addCategory = async (category) => {
    try {
        const response = await api.post('/categories', category);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi thêm danh mục:", error);
        throw error;
    }
};

// Cập nhật danh mục
export const updateCategory = async (id, category) => {
    try {
        const response = await api.put(`/categories/${id}`, category);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi cập nhật danh mục:", error);
        throw error;
    }
};

export const deleteCategory = async (id) => {
    try {
        const response = await api.delete(`/categories/${id}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi xóa danh mục:", error);
        throw error;
    }
};