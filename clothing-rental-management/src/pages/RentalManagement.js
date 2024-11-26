import { AppstoreOutlined, EditOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, message, Modal, Table } from 'antd';
import { useEffect, useState } from 'react';
import RentalFilter from '../components/RentalFilter';
import { fetchRentals } from '../services/rentalApi';

const RentalManagement = () => {
  const [rentals, setRentals] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingRental, setEditingRental] = useState(null); // Cho thuê đang chỉnh sửa
  const [form] = Form.useForm();

  // Hàm để lấy danh sách cho thuê từ API
  const loadRentals = async () => {
    setLoading(true);

    try {
      const response = await fetchRentals();  // Pass filters as a parameter to the API
      setRentals(response.data);
    } catch (error) {
      message.error("Lỗi khi tải cho thuê");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (editingRental) {
      form.setFieldsValue({
        name: editingRental.name,
      });
    } else {
      form.resetFields();
    }
  }, [editingRental])

  // Hiển thị modal để sửa cho thuê
  const handleEditRental = (rental) => {
    setEditingRental(rental); // Thiết lập cho thuê đang chỉnh sửa
    setIsModalVisible(true);
  };

  // Đóng modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingRental(null);
  };

  // Thêm cho thuê mới
  const handleFormSubmit = async (rental) => {
    loadRentals(); // Tải lại danh sách cho thuê sau khi thêm/sửa
    setIsModalVisible(false); // Đóng modal sau khi thêm/sửa
  };

  // Định nghĩa các cột cho bảng
  const columns = [
    { title: 'Mã KH', dataIndex: 'id', key: 'id', render: (text) => `#KTS_${text}` },
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    {
      title: 'Thao tác', key: 'action', render: (_, record) => (
        <>
          <Button onClick={() => handleEditRental(record)} icon={<EditOutlined />} style={{ marginRight: 8 }}>Sửa</Button>
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
            Quản lý cho thuê
          </h2>
        </div>
      </div>

      <RentalFilter setLoading={setLoading} setRentals={setRentals} />

      <Table
        dataSource={rentals}
        columns={columns}
        rowKey="id"
        loading={loading}
        scroll={{ x: 'max-content' }}  // Cho phép cuộn ngang
      />

      {/* Modal chỉnh sửa cho thuê */}
      <Modal
        title="Sửa thông tin cho thuê"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={1200}
      >
        <Form form={form} onFinish={() => { }} layout="vertical">
          <Form.Item
            label="Tên cho thuê"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên cho thuê' }]}
          >
            <Input placeholder="Nhập tên cho thuê" />
          </Form.Item>

          <Button type="primary" htmlType="submit" style={{ marginTop: 16 }}>
            Cập nhật
          </Button>

        </Form>
      </Modal>
    </div>
  );
};

export default RentalManagement;
