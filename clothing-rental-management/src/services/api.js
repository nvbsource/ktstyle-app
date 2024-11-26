import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:5005',
});

export const fetchProducts = async (filters) => {
    try {
        let queryParams;
        if (filters) {
            const { name, category, library, price, date } = filters;
            queryParams = new URLSearchParams();

            // Add filters to the query string
            if (name) queryParams.append('name', name);
            if (category) queryParams.append('category', category);
            if (library) queryParams.append('library', library);
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

export const fetchVariants = async (productId) => {
    try {
        const response = await api.get(`/variants/${productId}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách biến thể:", error);
        throw error;
    }
};

export const addVariant = async (variant) => {
    try {
        const response = await api.post('/variants', variant);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi thêm biến thể:", error);
        throw error;
    }
};

export const updateVariant = async (id, variant) => {
    try {
        const response = await api.put(`/variants/${id}`, variant);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi cập nhật biến thể:", error);
        throw error;
    }
};

export const deleteVariant = async (id) => {
    try {
        const response = await api.delete(`/variants/${id}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi xóa biến thể:", error);
        throw error;
    }
};

export const fetchContents = async (filters) => {
    try {
        let queryParams;
        if (filters) {
            const { name, category, date } = filters;
            queryParams = new URLSearchParams();

            // Add filters to the query string
            if (name) queryParams.append('name', name);
            if (category) queryParams.append('category', category);

            if (date && date.length === 2) {
                const [startDate, endDate] = date;
                queryParams.append('startDate', startDate.format('YYYY-MM-DD'));
                queryParams.append('endDate', endDate.format('YYYY-MM-DD'));
            }
        }
        const response = await api.get(`/contents${queryParams ? `?${queryParams.toString()}` : ''}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        throw error;
    }
};

export const addContent = async (content) => {
    try {
        const response = await api.post('/contents', content);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi thêm nội dung:", error);
        throw error;
    }
};

export const updateContent = async (id, product) => {
    try {
        const response = await api.put(`/contents/${id}`, product);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi cập nhật nội dung:", error);
        throw error;
    }
};

export const deleteContent = async (id) => {
    try {
        const response = await api.delete(`/contents/${id}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi xóa nội dung:", error);
        throw error;
    }
};


// Lấy tất cả chủ đề
export const fetchTopics = async (search) => {
    try {
        const response = await api.get(search ? `/topics?search=${search}` : '/topics');
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách chủ đề:", error);
        throw error;
    }
};

// Thêm danh mục mới
export const addTopic = async (topic) => {
    try {
        const response = await api.post('/topics', topic);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi thêm chủ đề:", error);
        throw error;
    }
};

// Cập nhật danh mục
export const updateTopic = async (id, topic) => {
    try {
        const response = await api.put(`/topics/${id}`, topic);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi cập nhật chủ đề:", error);
        throw error;
    }
};

// Xóa danh mục
export const deleteTopic = async (id) => {
    try {
        const response = await api.delete(`/topics/${id}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi xóa chủ đề:", error);
        throw error;
    }
};