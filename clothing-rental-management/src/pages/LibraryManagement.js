import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, message, Popconfirm } from 'antd'
import LibraryForm from '../components/LibraryForm'
import {
  fetchLibraries,
  addLibrary,
  updateLibrary,
  deleteLibrary,
} from '../services/libraryApi'
import { AppstoreOutlined } from '@ant-design/icons'

const LibraryManagement = () => {
  const [libraries, setLibraries] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingLibrary, setEditingLibrary] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadLibraries()
  }, [])

  // Hàm lấy danh sách thư viện hoặc thư viện
  const loadLibraries = async () => {
    setLoading(true)
    try {
      const response = await fetchLibraries()
      const data = response.data
      setLibraries(data)
    } catch (error) {
      message.error('Lỗi khi tải danh sách thư viện')
    }
    setLoading(false)
  }

  // Hiển thị modal để thêm thư viện mới
  const handleAddLibrary = () => {
    setEditingLibrary(null)
    setIsModalVisible(true)
  }

  // Hiển thị modal để sửa thư viện hiện tại
  const handleEditLibrary = (library) => {
    setEditingLibrary(library)
    setIsModalVisible(true)
  }

  // Đóng modal
  const handleCancel = () => {
    setIsModalVisible(false)
    setEditingLibrary(null)
  }

  // Thêm hoặc cập nhật thư viện
  const handleFormSubmit = async (library) => {
    try {
      if (editingLibrary) {
        // Cập nhật thư viện hiện tại
        const data = await updateLibrary(editingLibrary.id, library)
        message.success(data.message)
      } else {
        // Thêm thư viện mới
        const data = await addLibrary(library)
        message.success(data.message)
      }
      loadLibraries() // Tải lại danh sách thư viện sau khi thêm hoặc cập nhật
    } catch (error) {
      message.error(error.response?.data?.message)
    }
    setIsModalVisible(false)
  }

  // Xóa thư viện
  const handleDeleteLibrary = async (id) => {
    try {
      const data = await deleteLibrary(id)
      message.success(data.message)
      loadLibraries() // Tải lại danh sách sau khi xóa
    } catch (error) {
      message.error(error.response?.data?.message)
    }
  }

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
          <Button
            onClick={() => handleEditLibrary(record)}
            style={{ marginRight: 8 }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDeleteLibrary(record.id)}
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </>
      ),
    },
  ]

  return (
    <div className="p-8 bg-white rounded-md">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <AppstoreOutlined className="text-3xl" />
          <h2 className="text-2xl font-semibold">Quản lý thư viện</h2>
        </div>
        <Button
          type="primary"
          onClick={handleAddLibrary}
          style={{ marginBottom: 16 }}
        >
          Thêm thư viện
        </Button>
      </div>
      <Table
        dataSource={libraries}
        columns={columns}
        rowKey="id"
        loading={loading}
      />
      <Modal
        title={editingLibrary ? 'Sửa Thư viện' : 'Thêm Thư viện'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <LibraryForm onSubmit={handleFormSubmit} initialData={editingLibrary} />
      </Modal>
    </div>
  )
}

export default LibraryManagement
