import { AppstoreOutlined, EditOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, message, Modal, Table } from 'antd';
import { useEffect, useState } from 'react';
import CustomerFilter from '../components/CustomerFilter';
import { fetchCustomers, updateCustomer } from '../services/customerApi';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingCustomer, setEditingCustomer] = useState(null); // Sản phẩm đang chỉnh sửa
  const [form] = Form.useForm();

  // Hàm để lấy danh sách sản phẩm từ API
  const loadCustomers = async () => {
    setLoading(true);

    try {
      const response = await fetchCustomers();  // Pass filters as a parameter to the API
      setCustomers(response.data);
    } catch (error) {
      message.error("Lỗi khi tải sản phẩm");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (editingCustomer) {
      form.setFieldsValue({
        name: editingCustomer.name,
      });
    } else {
      form.resetFields();
    }
  }, [editingCustomer])

  // Hiển thị modal để sửa sản phẩm
  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer); // Thiết lập sản phẩm đang chỉnh sửa
    setIsModalVisible(true);
  };

  // Đóng modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingCustomer(null);
  };

  // Thêm sản phẩm mới
  const handleFormSubmit = async (customer) => {
    const data = await updateCustomer(editingCustomer.id, customer);
    message.success(data.message);

    loadCustomers(); // Tải lại danh sách sản phẩm sau khi thêm/sửa
    setIsModalVisible(false); // Đóng modal sau khi thêm/sửa
  };

  // Định nghĩa các cột cho bảng
  const columns = [
    { title: 'Mã KH', dataIndex: 'id', key: 'id', render: (text) => `#KTS_${text}` },
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    {
      title: 'Thao tác', key: 'action', render: (_, record) => (
        <>
          <Button onClick={() => handleEditCustomer(record)} icon={<EditOutlined />} style={{ marginRight: 8 }}>Sửa</Button>
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
            Quản lý khách hàng
          </h2>
        </div>
      </div>


      <CustomerFilter setLoading={setLoading} setCustomers={setCustomers} />


      <Table
        dataSource={customers}
        columns={columns}
        rowKey="id"
        loading={loading}
        scroll={{ x: 'max-content' }}  // Cho phép cuộn ngang
      />

      {/* Modal chỉnh sửa sản phẩm */}
      <Modal
        title="Sửa thông tin khách hàng"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={1200}
      >
        <Form form={form} onFinish={() => { }} layout="vertical">
          <Form.Item
            label="Tên khách hàng"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng' }]}
          >
            <Input placeholder="Nhập tên khách hàng" />
          </Form.Item>

          <Button type="primary" htmlType="submit" style={{ marginTop: 16 }}>
            Cập nhật
          </Button>

        </Form>
      </Modal>
    </div>
  );
};

export default CustomerManagement;
