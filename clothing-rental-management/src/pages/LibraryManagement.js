import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, message } from 'antd';
import CategoryForm from '../components/CategoryForm';
import { fetchCategories, addCategory, updateCategory, deleteCategory } from '../services/api';
import { AppstoreOutlined } from '@ant-design/icons';

const LibraryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadCategories();
    }, []);

    // Hàm lấy danh sách thư viện hoặc danh mục
    const loadCategories = async () => {
        setLoading(true);
        try {
            const response = await fetchCategories();
            const data = response.data;
            setCategories(data);
        } catch (error) {
            message.error("Lỗi khi tải danh sách thư viện");
        }
        setLoading(false);
    };

    // Hiển thị modal để thêm thư viện mới
    const handleAddCategory = () => {
        setEditingCategory(null);
        setIsModalVisible(true);
    };

    // Hiển thị modal để sửa danh mục hiện tại
    const handleEditCategory = (category) => {
        setEditingCategory(category);
        setIsModalVisible(true);
    };

    // Đóng modal
    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingCategory(null);
    };

    // Thêm hoặc cập nhật danh mục
    const handleFormSubmit = async (category) => {
        try {
            if (editingCategory) {
                // Cập nhật danh mục hiện tại
                const data = await updateCategory(editingCategory.id, category);
                message.success(data.message);
            } else {
                // Thêm danh mục mới
                const data = await addCategory(category);
                message.success(data.message);
            }
            loadCategories(); // Tải lại danh sách danh mục sau khi thêm hoặc cập nhật
        } catch (error) {
            message.error(error.response?.data?.message);
        }
        setIsModalVisible(false);
    };

    // Xóa danh mục
    const handleDeleteCategory = async (id) => {
        try {
            const data = await deleteCategory(id);
            message.success(data.message);
            loadCategories(); // Tải lại danh sách sau khi xóa
        } catch (error) {
            message.error(error.response?.data?.message);
        }
    };

    // Cấu hình cột của bảng
    const columns = [
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <>
                    <Button onClick={() => handleEditCategory(record)} style={{ marginRight: 8 }}>
                        Sửa
                    </Button>
                    <Button onClick={() => handleDeleteCategory(record.id)} danger>
                        Xóa
                    </Button>
                </>
            ),
        },
    ];

    return (
        <div className='p-8 bg-white rounded-md'>
            <div className='flex justify-between items-center mb-8'>
                <div className="flex items-center gap-2">
                    <AppstoreOutlined className="text-3xl" />
                    <h2 className="text-2xl font-semibold">
                        Quản lý danh mục
                    </h2>
                </div>
                <Button type="primary" onClick={handleAddCategory} style={{ marginBottom: 16 }}>
                    Thêm danh mục
                </Button>
            </div>
            <Table
                dataSource={categories}
                columns={columns}
                rowKey="id"
                loading={loading}
            />
            <Modal
                title={editingCategory ? "Sửa Thư viện" : "Thêm Thư viện"}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <CategoryForm onSubmit={handleFormSubmit} initialData={editingCategory} />
            </Modal>
        </div>
    );
};

export default LibraryManagement;
