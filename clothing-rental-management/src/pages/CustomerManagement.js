import { AppstoreOutlined, EditOutlined } from '@ant-design/icons'
import { Button, DatePicker, Form, Input, message, Modal, Table } from 'antd'
import { useEffect, useState } from 'react'
import CustomerFilter from '../components/CustomerFilter'
import { fetchCustomers, updateCustomer } from '../services/customerApi'
import { formatDate } from '../helpers/helpers'
import dayjs from 'dayjs'

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [loading, setLoading] = useState(true)
  const [editingCustomer, setEditingCustomer] = useState(null) // Sản phẩm đang chỉnh sửa
  const [form] = Form.useForm()

  // Hàm để lấy danh sách sản phẩm từ API
  const loadCustomers = async () => {
    setLoading(true)

    try {
      const response = await fetchCustomers() // Pass filters as a parameter to the API
      setCustomers(response.data)
    } catch (error) {
      message.error('Lỗi khi tải sản phẩm')
    }
    setLoading(false)
  }

  useEffect(() => {
    if (editingCustomer) {
      form.setFieldsValue({
        name: editingCustomer.name,
        phone: editingCustomer.phone,
        dob: editingCustomer.dob ? dayjs(editingCustomer.dob) : null,
      })
    }
  }, [editingCustomer])

  // Hiển thị modal để sửa sản phẩm
  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer) // Thiết lập sản phẩm đang chỉnh sửa
    setIsModalVisible(true)
  }

  // Đóng modal
  const handleCancel = () => {
    setIsModalVisible(false)
    setEditingCustomer(null)
  }

  // Thêm sản phẩm mới
  const handleFormSubmit = async (values) => {
    try {
      const formattedValues = {
        ...values,
        dob: values.dob ? values.dob.format('YYYY-MM-DD') : null,
      }
      const data = await updateCustomer(editingCustomer.id, formattedValues)
      message.success(data.message)
      loadCustomers()
      handleCancel()
    } catch (error) {
      message.error(error.response?.data?.message)
    }
  }

  // Định nghĩa các cột cho bảng
  const columns = [
    { title: 'Mã KH', dataIndex: 'id', key: 'id', render: (text) => `${text}` },
    { title: 'Họ và tên', dataIndex: 'name', key: 'name' },
    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
    {
      title: 'Sinh nhật',
      dataIndex: 'dob',
      key: 'dob',
      render: (text) =>
        text ? formatDate(text, 'dd/MM/yyyy') : 'Chưa cập nhật',
    },
    {
      title: 'Ngày tham gia',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => (text ? formatDate(text) : 'Chưa cập nhật'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <>
          <Button
            onClick={() => handleEditCustomer(record)}
            icon={<EditOutlined />}
            style={{ marginRight: 8 }}
          >
            Sửa
          </Button>
        </>
      ),
    },
  ]
  console.log(editingCustomer)

  return (
    <div className="p-8 bg-white rounded-md">
      <div className="flex flex-col md:flex-row mb-8">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <AppstoreOutlined className="text-3xl" />
          <h2 className="text-2xl font-semibold">Quản lý khách hàng</h2>
        </div>
      </div>

      <CustomerFilter setLoading={setLoading} setCustomers={setCustomers} />

      <Table
        dataSource={customers}
        columns={columns}
        rowKey="id"
        loading={loading}
        scroll={{ x: 'max-content' }} // Cho phép cuộn ngang
      />

      {/* Modal chỉnh sửa sản phẩm */}
      <Modal
        title="Sửa thông tin khách hàng"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={1200}
      >
        <Form form={form} onFinish={handleFormSubmit} layout="vertical">
          <Form.Item
            label="Tên khách hàng"
            name="name"
            rules={[
              { required: true, message: 'Vui lòng nhập tên khách hàng' },
            ]}
          >
            <Input placeholder="Nhập tên khách hàng" />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            label="Sinh nhật"
            name="dob"
            rules={[{ required: true, message: 'Vui lòng nhập sinh nhật' }]}
          >
            <DatePicker format="DD/MM/YYYY" />
          </Form.Item>

          <Button type="primary" htmlType="submit" style={{ marginTop: 16 }}>
            Cập nhật
          </Button>
        </Form>
      </Modal>
    </div>
  )
}

export default CustomerManagement
