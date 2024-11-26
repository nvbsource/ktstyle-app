import { api } from "./api";

// Lấy tất cả thư viện
export const fetchLibraries = async () => {
    try {
        const response = await api.get('/libraries');
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách thư viện:", error);
        throw error;
    }
};

// Thêm thư viện mới
export const addLibrary = async (library) => {
    try {
        const response = await api.post('/libraries', library);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi thêm thư viện:", error);
        throw error;
    }
};

// Cập nhật thư viện
export const updateLibrary = async (id, library) => {
    try {
        const response = await api.put(`/libraries/${id}`, library);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi cập nhật thư viện:", error);
        throw error;
    }
};

export const deleteLibrary = async (id) => {
    try {
        const response = await api.delete(`/libraries/${id}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi xóa thư viện:", error);
        throw error;
    }
};