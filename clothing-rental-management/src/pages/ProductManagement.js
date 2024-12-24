import {
  AppstoreOutlined,
  DeleteOutlined,
  EyeOutlined,
  FrownOutlined,
} from '@ant-design/icons'
import {
  Button,
  Col,
  DatePicker,
  message,
  Modal,
  Popconfirm,
  Row,
  Switch,
  Table,
  Tag,
} from 'antd'
import { useState } from 'react'
import ProductCard from '../components/ProductCard'
import ProductFilter from '../components/ProductFilter'
import ProductForm from '../components/ProductForm'
import ProductView from '../components/ProductView'
import { formatDate, formatNumberToCurrency } from '../helpers/helpers'
import {
  addProduct,
  addVariant,
  deleteProduct,
  fetchProducts,
  updateProduct,
  updateVariant,
} from '../services/api'

const { RangePicker } = DatePicker

const ProductManagement = () => {
  const [products, setProducts] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null) // Sản phẩm đang chỉnh sửa
  const [isCardView, setIsCardView] = useState(true) // Kiểm tra chế độ hiển thị: Table or Card
  const [selectedProduct, setSelectedProduct] = useState(null) // Sản phẩm đang xem chi tiết
  const [itemType, setItemType] = useState('product')
  const [filters, setFilters] = useState({
    id: '',
    name: '',
    category: null,
    library: null,
    price: null,
    date: [],
  })
  
  // Hàm để lấy danh sách sản phẩm từ API
  const loadProducts = async () => {
    setLoading(true)
    try {
      const response = await fetchProducts(filters, itemType) // Pass filters as a parameter to the API
      setProducts(response.data)
    } catch (error) {
      message.error('Lỗi khi tải sản phẩm')
    }
    setLoading(false)
  }

  // Hiển thị modal thêm hoặc sửa sản phẩm
  const handleAddProduct = () => {
    setEditingProduct(null) // Khi thêm mới, không có sản phẩm nào đang chỉnh sửa
    setIsModalVisible(true)
  }

  // Hiển thị modal để sửa sản phẩm
  const handleEditProduct = (product) => {
    setEditingProduct(product) // Thiết lập sản phẩm đang chỉnh sửa
    setIsModalVisible(true)
    setSelectedProduct(null)
  }

  // Đóng modal
  const handleCancel = () => {
    setIsModalVisible(false)
    setEditingProduct(null)
  }

  // Thêm sản phẩm mới
  const handleFormSubmit = async (product) => {
    if (editingProduct) {
      const data = await updateProduct(editingProduct.id, product, itemType)
      message.success(data.message)
    } else {
      const data = await addProduct(product, itemType)
      message.success(data.message)
    }
    loadProducts() // Tải lại danh sách sản phẩm sau khi thêm/sửa
    setIsModalVisible(false) // Đóng modal sau khi thêm/sửa
  }

  // Thêm sản phẩm mới
  const handleFormVariantSubmit = async (variant, editVariantId) => {
    if (editingProduct) {
      if (editVariantId) {
        const data = await updateVariant(editVariantId, variant)
        message.success(data.message)
      } else {
        const data = await addVariant({
          product_id: editingProduct.id,
          ...variant,
        })
        message.success(data.message)
      }
    }
    loadProducts() // Tải lại danh sách sản phẩm sau khi thêm/sửa
  }

  // Xóa sản phẩm
  const handleDelete = async (id) => {
    try {
      const data = await deleteProduct(id)
      message.success(data.message)
      loadProducts() // Tải lại danh sách sau khi xóa
    } catch (error) {
      message.error(error.response?.data?.message)
    }
  }

  // Mảng màu sắc
  const libraryColors = [
    'magenta',
    'red',
    'volcano',
    'orange',
    'gold',
    'lime',
    'green',
    'cyan',
    'blue',
    'geekblue',
    'purple',
  ]

  // Định nghĩa các cột cho bảng
  const columns = [
    {
      title: 'Mã SP',
      dataIndex: 'id',
      key: 'id',
      render: (text) => `#KTS_${text}`,
    },
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    { title: 'Mô tả', dataIndex: 'description', key: 'description' },
    {
      title: 'Giá nhập',
      dataIndex: 'import_price',
      key: 'import_price',
      render: (text) => `${formatNumberToCurrency(text)} VND`,
    },
    {
      title: 'Giá thuê',
      dataIndex: 'rental_price',
      key: 'rental_price',
      render: (text) => `${formatNumberToCurrency(text)} VND`,
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      render: (category) => (!category ? 'Chưa cập nhật' : category.name),
    },
    {
      ...(itemType === 'product'
        ? {
            title: 'Thư viện',
            key: 'libraries',
            render: (_, record) =>
              record.libraries &&
              record.libraries.map((library) => (
                <Tag
                  color={
                    libraryColors[
                      Math.floor(Math.random() * libraryColors.length)
                    ]
                  }
                  key={library.id}
                >
                  {library.name}
                </Tag>
              )),
          }
        : {}),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => formatDate(text),
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (text) => formatDate(text),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <>
          <Button
            onClick={() => setSelectedProduct(record)}
            icon={<EyeOutlined />}
            style={{ marginRight: 8 }}
          >
            Xem
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ]

  const getTypeName = () => (itemType === 'product' ? 'Sản phẩm' : 'Phụ kiện')

  // Hiển thị sản phẩm theo dạng card
  const renderProductCards = () => {
    return (
      <Row gutter={[16, 16]}>
        {products.map((product) => (
          <Col
            key={product.id}
            xs={24}
            sm={12}
            md={8}
            lg={6}
            xl={4} // Responsive cột theo kích thước màn hình
          >
            <ProductCard
              product={product}
              setSelectedProduct={setSelectedProduct}
              selectedProduct={selectedProduct}
            />
          </Col>
        ))}
        {products.length === 0 && (
          <div className="flex justify-center items-center flex-col p-6 mx-auto">
            <FrownOutlined className="text-4xl text-gray-600 animate-bounce mb-4" />
            <h3 className="text-center text-lg text-gray-700 font-semibold">
              Không có {getTypeName()} nào được tìm thấy
            </h3>
          </div>
        )}
      </Row>
    )
  }

  return (
    <div className="p-8 bg-white rounded-md">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <AppstoreOutlined className="text-3xl" />
          <h2 className="text-2xl font-semibold">
            Quản lý {getTypeName()} ({products.length})
          </h2>
          <div className="flex items-center mt-4 sm:mt-0">
            <Switch
              checked={itemType === 'accessory'}
              onChange={() =>
                setItemType((item) =>
                  item === 'accessory' ? 'product' : 'accessory'
                )
              }
              className="mr-3"
            />
            <span className="text-sm">Xem phụ kiện</span>
          </div>
        </div>
        <Button type="primary" onClick={handleAddProduct}>
          Thêm {getTypeName()}
        </Button>
      </div>
      <ProductFilter
        itemType={itemType}
        setIsCardView={setIsCardView}
        isCardView={isCardView}
        setFilters={setFilters}
        filters={filters}
        loadProducts={loadProducts}
      />
      {isCardView ? (
        renderProductCards()
      ) : (
        <Table
          dataSource={products}
          columns={columns}
          rowKey="id"
          loading={loading}
          scroll={{ x: 'max-content' }} // Cho phép cuộn ngang
        />
      )}
      {/* Modal chỉnh sửa sản phẩm */}
      {(editingProduct || isModalVisible) && (
        <Modal
          title={
            editingProduct ? `Sửa ${getTypeName()}` : `Thêm ${getTypeName()}`
          }
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={1200}
        >
          <ProductForm
            onSubmit={handleFormSubmit}
            onSubmitVariant={handleFormVariantSubmit}
            initialData={editingProduct}
            itemType={itemType}
          />
        </Modal>
      )}
      {/* Modal chi tiết sản phẩm */}
      {selectedProduct && (
        <Modal
          visible={!!selectedProduct}
          onCancel={() => setSelectedProduct(null)}
          footer={null}
          width="80%"
          title={`Chi tiết ${getTypeName()}`}
        >
          <ProductView
            selectedProduct={selectedProduct}
            editProduct={handleEditProduct}
            itemType={itemType}
          />
        </Modal>
      )}
    </div>
  )
}

export default ProductManagement
