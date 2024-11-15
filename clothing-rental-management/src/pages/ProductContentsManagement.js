import { useState, useEffect } from 'react';
import { Table, Button, Modal, message, Tag, Card, Row, Col, Input, Select, Switch, Space, DatePicker, Slider } from 'antd';
import ProductForm from '../components/ProductForm';
import { fetchProducts, addProduct, deleteProduct, updateProduct, fetchCategories } from '../services/api';
import { formatNumberToCurrency } from '../helpers/helpers';
import ProductCard from '../components/ProductCard';
import { AppstoreOutlined, DeleteOutlined, EditOutlined, EyeOutlined, FrownOutlined } from '@ant-design/icons';
import ProductFilter from '../components/ProductFilter';
import AddContentModal from '../components/AddContentModal';

const { RangePicker } = DatePicker;

const ProductContentsManagement = () => {
  const [products, setProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null); // Sản phẩm đang chỉnh sửa
  const [isCardView, setIsCardView] = useState(true); // Kiểm tra chế độ hiển thị: Table or Card
  const [selectedProduct, setSelectedProduct] = useState(null); // Sản phẩm đang xem chi tiết

  // Hàm để lấy danh sách sản phẩm từ API
  const loadProducts = async () => {
    setLoading(true);

    try {
      const response = await fetchProducts();  // Pass filters as a parameter to the API
      setProducts(response.data);
    } catch (error) {
      message.error("Lỗi khi tải sản phẩm");
    }
    setLoading(false);
  };

  // Hiển thị modal thêm hoặc sửa sản phẩm
  const handleAddContent = () => {
    setEditingProduct(null); // Khi thêm mới, không có sản phẩm nào đang chỉnh sửa
    setIsModalVisible(true);
  };

  // Hiển thị modal để sửa sản phẩm
  const handleEditProduct = (product) => {
    setSelectedProduct(null);
    setEditingProduct(product); // Thiết lập sản phẩm đang chỉnh sửa
    setIsModalVisible(true);
  };

  // Đóng modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingProduct(null);
  };

  // Thêm sản phẩm mới
  const handleFormSubmit = async (product) => {
    if (editingProduct) {
      const data = await updateProduct(editingProduct.id, product);
      message.success(data.message);
    } else {
      const data = await addProduct(product);
      message.success(data.message);
    }
    loadProducts(); // Tải lại danh sách sản phẩm sau khi thêm/sửa
    setIsModalVisible(false); // Đóng modal sau khi thêm/sửa
  };

  // Xóa sản phẩm
  const handleDelete = async (id) => {
    try {
      const data = await deleteProduct(id);
      message.success(data.message);
      loadProducts(); // Tải lại danh sách sau khi xóa
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
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    { title: 'Mô tả', dataIndex: 'description', key: 'description' },
    {
      title: 'Giá nhập', dataIndex: 'import_price', key: 'import_price', render: (text) => `${formatNumberToCurrency(text)} VND`
    },
    { title: 'Giá thuê', dataIndex: 'rental_price', key: 'rental_price', render: (text) => `${formatNumberToCurrency(text)} VND` },
    {
      title: 'Danh mục', key: 'categories', render: (_, record) => (
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
          <Button onClick={() => setSelectedProduct(record)} icon={<EyeOutlined />} style={{ marginRight: 8 }}>Xem</Button>
          <Button onClick={() => handleEditProduct(record)} icon={<EditOutlined />} style={{ marginRight: 8 }}>Sửa</Button>
          <Button onClick={() => handleDelete(record.id)} danger icon={<DeleteOutlined />}>Xóa</Button>
        </>
      )
    }
  ];

  // Hiển thị sản phẩm theo dạng card
  const renderProductCards = () => {
    return (
      <Row gutter={[16, 16]}>
        {products.map((product) => (
          <Col
            key={product.id}
            xs={24} sm={12} md={8} lg={6} xl={4} // Responsive cột theo kích thước màn hình
          >
            <ProductCard product={product} setSelectedProduct={setSelectedProduct} />
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


      <ProductFilter setLoading={setLoading} setProducts={setProducts} setIsCardView={setIsCardView} isCardView={isCardView} />

      {isCardView ? renderProductCards() : (
        <Table
          dataSource={products}
          columns={columns}
          rowKey="id"
          loading={loading}
          scroll={{ x: 'max-content' }}  // Cho phép cuộn ngang
        />
      )}
    </div>
    <AddContentModal visible={isModalVisible} onCancel={handleCancel} onCreate={handleFormSubmit}/>
    </>
  );
};

export default ProductContentsManagement;
