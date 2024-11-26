import { useState, useEffect } from 'react';
import { Table, Button, Modal, message, Tag, Card, Row, Col, Input, Select, Switch, Space, DatePicker, Slider } from 'antd';
import { fetchContents, addContent, deleteContent, updateContent, fetchCategories } from '../services/api';
import { formatNumberToCurrency, truncateString } from '../helpers/helpers';
// import ContentCard from '../components/ContentCard';
import { AppstoreOutlined, DeleteOutlined, EditOutlined, EyeOutlined, FrownOutlined } from '@ant-design/icons';
import ContentForm from '../components/ContentForm';
import ContentFilter from '../components/ContentFilter';
import TopicManageModal from '../components/TopicManageModal';

const ContentManagement = () => {
  const [products, setContents] = useState([]);
  const [isTopicModalVisible, setIsTopicModalVisible] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingContent, setEditingContent] = useState(null); // Sản phẩm đang chỉnh sửa
  const [isCardView, setIsCardView] = useState(false); // Kiểm tra chế độ hiển thị: Table or Card
  const [selectedContent, setSelectedContent] = useState(null); // Sản phẩm đang xem chi tiết

  // Hàm để lấy danh sách sản phẩm từ API
  const loadContents = async () => {
    setLoading(true);

    try {
      const response = await fetchContents();  // Pass filters as a parameter to the API
      setContents(response.data);
    } catch (error) {
      message.error("Lỗi khi tải sản phẩm");
    }
    setLoading(false);
  };

  // Hiển thị modal thêm hoặc sửa sản phẩm
  const handleAddContent = () => {
    setEditingContent(null); // Khi thêm mới, không có sản phẩm nào đang chỉnh sửa
    setIsModalVisible(true);
  };

  // Hiển thị modal để sửa sản phẩm
  const handleEditContent = (product) => {
    setSelectedContent(null);
    setEditingContent(product); // Thiết lập sản phẩm đang chỉnh sửa
    setIsModalVisible(true);
  };

  // Đóng modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingContent(null);
  };

  // Thêm sản phẩm mới
  const handleFormSubmit = async (content) => {
    if (editingContent) {
      const data = await updateContent(editingContent.id, content);
      message.success(data.message);
    } else {
      const data = await addContent(content);
      message.success(data.message);
    }
    loadContents(); // Tải lại danh sách sản phẩm sau khi thêm/sửa
    setIsModalVisible(false); // Đóng modal sau khi thêm/sửa
  };

  // Xóa sản phẩm
  const handleDelete = async (id) => {
    try {
      const data = await deleteContent(id);
      message.success(data.message);
      loadContents(); // Tải lại danh sách sau khi xóa
    } catch (error) {
      message.error(error.response?.data?.message);
    }
  };

  // Mảng màu sắc
  const categoryColors = [
    "magenta", "red", "volcano", "orange", "gold", "lime", "green",
    "cyan", "blue", "geekblue", "purple"
  ];

  // Định nghĩa các cột cho bảng
  const columns = [
    { title: 'Mã SP', dataIndex: 'id', key: 'id', render: (text) => `#KTS_${text}` },
    { title: 'Nội dung', dataIndex: 'content', key: 'content', render: (text) => truncateString(text, 100) },
    { title: 'Liên kết sản phẩm', dataIndex: 'product', key: 'product', render: (obj) => obj?.name || "Không có sản phẩm" },
    {
      title: 'Chủ đề', key: 'categories', render: (_, record) => (
        record.categories && record.categories.map((category) => (
          <Tag color={categoryColors[Math.floor(Math.random() * categoryColors.length)]} key={category.id}>
            {category.name}
          </Tag>
        ))
      )
    },
    {
      title: 'Thao tác', key: 'action', render: (_, record) => (
        <>
          <Button onClick={() => handleEditContent(record)} icon={<EditOutlined />} style={{ marginRight: 8 }}>Sửa</Button>
          <Button onClick={() => handleDelete(record.id)} danger icon={<DeleteOutlined />}>Xóa</Button>
        </>
      )
    }
  ];

  // Hiển thị sản phẩm theo dạng card
  const renderContentCards = () => {
    return (
      <Row gutter={[16, 16]}>
        {products.map((product) => (
          <Col
            key={product.id}
            xs={24} sm={12} md={8} lg={6} xl={4} // Responsive cột theo kích thước màn hình
          >
            {/* <ContentCard product={product} setSelectedContent={setSelectedContent} /> */}
          </Col>
        ))}
        {products.length === 0 && <div className="flex justify-center items-center flex-col p-6 mx-auto">
          <FrownOutlined className="text-4xl text-gray-500 animate-bounce mb-4" />
          <h3 className="text-center text-lg text-gray-700 font-semibold">
            Không có sản phẩm nào được tìm thấy
          </h3>
        </div>}
      </Row>
    );
  };


  return (
    <>
      <div className='p-8 bg-white rounded-md'>
        <div className='flex flex-col md:flex-row justify-between items-center mb-8'>
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <AppstoreOutlined className="text-3xl" />
            <h2 className="text-2xl font-semibold">
              Quản lý nội dung
            </h2>
          </div>
          <Button type="primary" onClick={handleAddContent}>
            Thêm bài viết
          </Button>
        </div>


        <ContentFilter setLoading={setLoading} setContents={setContents} setIsCardView={setIsCardView} isCardView={isCardView} />

        {isCardView ? renderContentCards() : (
          <Table
            dataSource={products}
            columns={columns}
            rowKey="id"
            loading={loading}
            scroll={{ x: 'max-content' }}  // Cho phép cuộn ngang
          />
        )}
      </div>
      <ContentForm visible={isModalVisible} onCancel={handleCancel} onCreate={handleFormSubmit} initialData={editingContent} />
      <TopicManageModal visible={isTopicModalVisible} setShowTocpic={setIsTopicModalVisible}/>
    </>
  );
};

export default ContentManagement;
