import React, { useState, useEffect } from 'react'
import { Tree, Button, Modal, message, Popconfirm } from 'antd'
import {
  FolderOpenOutlined,
  FolderOutlined,
  FileOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import CategoryForm from '../components/CategoryForm'
import {
  addCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
} from '../services/categoryApi'

const CategoryManagement = () => {
  const [treeData, setTreeData] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [expandedKeys, setExpandedKeys] = useState(null)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const response = await fetchCategories()
      setTreeData(transformCategoriesToTreeData(response.data))
    } catch (error) {
      message.error('Lỗi khi tải danh mục')
    }
  }

  useEffect(() => {
    if (treeData.length > 0) {
      const keys = getAllKeys(treeData)
      setExpandedKeys(keys)
    }
  }, [treeData])

  const getAllKeys = (data) => {
    const keys = []
    data.forEach((item) => {
      keys.push(item.key)
      if (item.children && item.children.length > 0) {
        keys.push(...getAllKeys(item.children))
      }
    })
    return keys
  }

  const transformCategoriesToTreeData = (categories) => {
    return categories.map((category) => ({
      title: category.name,
      key: category.id,
      icon:
        category.children && category.children.length > 0 ? (
          <FolderOutlined />
        ) : (
          <FileOutlined />
        ),
      children:
        category.children && category.children.length > 0
          ? transformCategoriesToTreeData(category.children)
          : [],
    }))
  }

  const findCategoryById = (id, data, parent = null) => {
    for (const item of data) {
      if (item.key === id) {
        return {
          ...item,
          parent_id: parent ? parent.key : null,
        }
      }
      if (item.children) {
        const result = findCategoryById(id, item.children, item)
        if (result) return result
      }
    }
    return null
  }

  const handleAddCategory = () => {
    setEditingCategory(null)
    setIsModalVisible(true)
  }

  const handleEditCategory = (categoryId) => {
    const category = findCategoryById(categoryId, treeData)
    setEditingCategory(category)
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    setEditingCategory(null)
  }

  const handleDeleteCategory = async (id) => {
    try {
      const data = await deleteCategory(id)
      message.success(data.message)
      loadCategories() // Tải lại danh sách sau khi xóa
    } catch (error) {
      message.error(error.response?.data?.message)
    }
  }

  const handleFormSubmit = async (category) => {
    try {
      if (editingCategory) {
        const data = await updateCategory(editingCategory.key, category)
        message.success(data.message)
      } else {
        const data = await addCategory(category)
        message.success(data.message)
      }
      loadCategories()
    } catch (error) {
      message.error(error.response?.data?.message || 'Đã xảy ra lỗi')
    }
    setIsModalVisible(false)
  }

  const renderTreeNodes = (data) => {
    return data.map((item) => ({
      title: (
        <div className="flex justify-between items-center hover:bg-gray-100">
          <span className="text-gray-800 font-medium mr-3">{item.title}</span>
          <div className="flex space-x-2">
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEditCategory(item.key)}
              className="hover:text-blue-600"
            />
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa?"
              onConfirm={() => handleDeleteCategory(item.key)}
            >
              <Button
                size="small"
                danger
                icon={<DeleteOutlined />}
                className="hover:text-red-600"
              />
            </Popconfirm>
          </div>
        </div>
      ),
      key: item.key,
      icon: item.icon, // Biểu tượng
      children:
        item.children && item.children.length > 0
          ? renderTreeNodes(item.children)
          : null,
    }))
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Quản lý danh mục
        </h2>
        <Button
          type="primary"
          className="bg-green-500 text-white hover:bg-green-600"
          onClick={handleAddCategory}
        >
          Thêm danh mục
        </Button>
      </div>
      <Tree
        treeData={renderTreeNodes(treeData)}
        showLine={{ showLeafIcon: false }}
        expandedKeys={expandedKeys}
        onExpand={(keys) => setExpandedKeys(keys)}
        className="space-y-2"
        draggable
        blockNode
      />
      <Modal
        title={editingCategory ? 'Sửa danh mục' : 'Thêm danh mục'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <CategoryForm
          onSubmit={handleFormSubmit}
          initialData={editingCategory}
          treeData={treeData}
        />
      </Modal>
    </div>
  )
}

export default CategoryManagement
