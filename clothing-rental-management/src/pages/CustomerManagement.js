import { AppstoreOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Col, DatePicker, Form, Input, message, Modal, Row, Table } from 'antd'
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
        facebook: editingCustomer.facebook,
        zalo: editingCustomer.zalo,
        instagram: editingCustomer.instagram,
        more_social: editingCustomer.more_social,
        note: editingCustomer.note,
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
    { title: 'Facebook', dataIndex: 'facebook', key: 'facebook' },
    { title: 'Zalo', dataIndex: 'zalo', key: 'zalo' },
    { title: 'Instagram', dataIndex: 'instagram', key: 'instagram' },
    { title: 'Nền tảng khác', dataIndex:'more_social', key:'more_social' },
    { title: 'Ghi chú', dataIndex: 'note', key: 'note' },
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
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item label="Facebook" name="facebook">
                <Input placeholder="Nhập link facebook" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Instagram" name="instagram">
                <Input placeholder="Nhập ID hoặc link instagram" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Zalo" name="zalo">
                <Input placeholder="Nhập số điện thoại zalo" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Mạng xã hội khác" name="more_social">
            <Input placeholder="Nhập link trang cá nhân của khách hàng" />
          </Form.Item>
          <Form.Item label="Ghi chú" name="note">
            <Input placeholder="Nhập ghi chú nếu có" />
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
