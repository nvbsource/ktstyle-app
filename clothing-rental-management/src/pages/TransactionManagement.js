import { AppstoreOutlined, EditOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, message, Modal, Table } from 'antd';
import { useEffect, useState } from 'react';
import TransactionFilter from '../components/TransactionFilter';
import { fetchTransactions } from '../services/transactionApi';

const TransactionManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingTransaction, setEditingTransaction] = useState(null); // Sản phẩm đang chỉnh sửa
  const [form] = Form.useForm();

  // Hàm để lấy danh sách sản phẩm từ API
  const loadTransactions = async () => {
    setLoading(true);

    try {
      const response = await fetchTransactions();  // Pass filters as a parameter to the API
      setTransactions(response.data);
    } catch (error) {
      message.error("Lỗi khi tải sản phẩm");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (editingTransaction) {
      form.setFieldsValue({
        name: editingTransaction.name,
      });
    } else {
      form.resetFields();
    }
  }, [editingTransaction])

  // Hiển thị modal để sửa sản phẩm
  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction); // Thiết lập sản phẩm đang chỉnh sửa
    setIsModalVisible(true);
  };

  // Đóng modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingTransaction(null);
  };

  // Thêm sản phẩm mới
  const handleFormSubmit = async (transaction) => {
    loadTransactions(); // Tải lại danh sách sản phẩm sau khi thêm/sửa
    setIsModalVisible(false); // Đóng modal sau khi thêm/sửa
  };

  // Định nghĩa các cột cho bảng
  const columns = [
    { title: 'Mã KH', dataIndex: 'id', key: 'id', render: (text) => `#KTS_${text}` },
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    {
      title: 'Thao tác', key: 'action', render: (_, record) => (
        <>
          <Button onClick={() => handleEditTransaction(record)} icon={<EditOutlined />} style={{ marginRight: 8 }}>Sửa</Button>
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
            Quản lý giao dịch
          </h2>
        </div>
      </div>

      <TransactionFilter setLoading={setLoading} setTransactions={setTransactions} />

      <Table
        dataSource={transactions}
        columns={columns}
        rowKey="id"
        loading={loading}
        scroll={{ x: 'max-content' }}  // Cho phép cuộn ngang
      />

      {/* Modal chỉnh sửa sản phẩm */}
      <Modal
        title="Sửa thông tin giao dịch"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={1200}
      >
        <Form form={form} onFinish={() => { }} layout="vertical">
          <Form.Item
            label="Tên giao dịch"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên giao dịch' }]}
          >
            <Input placeholder="Nhập tên giao dịch" />
          </Form.Item>

          <Button type="primary" htmlType="submit" style={{ marginTop: 16 }}>
            Cập nhật
          </Button>

        </Form>
      </Modal>
    </div>
  );
};

export default TransactionManagement;
