import { AppstoreOutlined, EditOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, message, Modal, Table } from 'antd';
import { useEffect, useState } from 'react';
import OrderFilter from '../components/OrderFilter';
import { fetchOrders } from '../services/orderApi';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState(null); // Hoá đơn đang chỉnh sửa
  const [form] = Form.useForm();

  // Hàm để lấy danh sách hoá đơn từ API
  const loadOrders = async () => {
    setLoading(true);

    try {
      const response = await fetchOrders();  // Pass filters as a parameter to the API
      setOrders(response.data);
    } catch (error) {
      message.error("Lỗi khi tải hoá đơn");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (editingOrder) {
      form.setFieldsValue({
        name: editingOrder.name,
      });
    } else {
      form.resetFields();
    }
  }, [editingOrder])

  // Hiển thị modal để sửa hoá đơn
  const handleEditOrder = (order) => {
    setEditingOrder(order); // Thiết lập hoá đơn đang chỉnh sửa
    setIsModalVisible(true);
  };

  // Đóng modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingOrder(null);
  };

  // Thêm hoá đơn mới
  const handleFormSubmit = async (order) => {
    loadOrders(); // Tải lại danh sách hoá đơn sau khi thêm/sửa
    setIsModalVisible(false); // Đóng modal sau khi thêm/sửa
  };

  // Định nghĩa các cột cho bảng
  const columns = [
    { title: 'Mã KH', dataIndex: 'id', key: 'id', render: (text) => `#KTS_${text}` },
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    {
      title: 'Thao tác', key: 'action', render: (_, record) => (
        <>
          <Button onClick={() => handleEditOrder(record)} icon={<EditOutlined />} style={{ marginRight: 8 }}>Sửa</Button>
        </>
      )
    }
  ];

  return (
    <div className='p-8 bg-white rounded-md'>
      <div className='flex flex-col md:flex-row mb-8'>
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <AppstoreOutlined className="text-3xl" />
          <h2 className="text-2xl font-semibold">
            Quản lý hoá đơn
          </h2>
        </div>
      </div>

      <OrderFilter setLoading={setLoading} setOrders={setOrders} />

      <Table
        dataSource={orders}
        columns={columns}
        rowKey="id"
        loading={loading}
        scroll={{ x: 'max-content' }}  // Cho phép cuộn ngang
      />

      {/* Modal chỉnh sửa hoá đơn */}
      <Modal
        title="Sửa thông tin hoá đơn"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={1200}
      >
        <Form form={form} onFinish={() => { }} layout="vertical">
          <Form.Item
            label="Tên hoá đơn"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên hoá đơn' }]}
          >
            <Input placeholder="Nhập tên hoá đơn" />
          </Form.Item>

          <Button type="primary" htmlType="submit" style={{ marginTop: 16 }}>
            Cập nhật
          </Button>

        </Form>
      </Modal>
    </div>
  );
};

export default OrderManagement;
