import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5005',
});

export const fetchProducts = async (filters) => {
    try {
        let queryParams;
        if (filters) {
            const { name, category, price, date } = filters;
            queryParams = new URLSearchParams();

            // Add filters to the query string
            if (name) queryParams.append('name', name);
            if (category) queryParams.append('category', category);
            if (price && price.length === 2) {
                queryParams.append('priceRange', price.join(","));
            }

            if (date && date.length === 2) {
                const [startDate, endDate] = date;
                queryParams.append('startDate', startDate.format('YYYY-MM-DD'));
                queryParams.append('endDate', endDate.format('YYYY-MM-DD'));
            }
        }
        const response = await api.get(`/products${queryParams ? `?${queryParams.toString()}` : ''}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        throw error;
    }
};

export const addProduct = async (product) => {
    try {
        const response = await api.post('/products', product);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi thêm sản phẩm:", error);
        throw error;
    }
};

export const updateProduct = async (id, product) => {
    try {
        const response = await api.put(`/products/${id}`, product);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi cập nhật sản phẩm:", error);
        throw error;
    }
};

export const deleteProduct = async (id) => {
    try {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
        throw error;
    }
};


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

// Xóa danh mục
export const deleteCategory = async (id) => {
    try {
        const response = await api.delete(`/categories/${id}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi xóa danh mục:", error);
        throw error;
    }
};