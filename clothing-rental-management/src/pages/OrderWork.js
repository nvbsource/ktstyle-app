import React, { useEffect, useState } from 'react'
import {
  Tabs,
  Input,
  Button,
  Card,
  Radio,
  Select,
  Form,
  Modal,
  Switch,
  Divider,
  message,
} from 'antd'
import 'tailwindcss/tailwind.css'
import { fetchProducts } from '../services/api'
import { formatNumberToCurrency } from '../helpers/helpers'
import ProductOrderCard from '../components/ProductOrderCard'

const { TabPane } = Tabs
const { Meta } = Card
const { Option } = Select

const InvoicePage = () => {
  const [products, setProducts] = useState([])
  const [tabs, setTabs] = useState([
    {
      key: '1',
      title: 'Khách hàng 1',
      customerInfo: { name: '', phone: '' },
      products: [],
    },
  ])
  const [activeKey, setActiveKey] = useState('1')
  const [filterType, setFilterType] = useState('product')
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [isSearching, setIsSearching] = useState(true)
  const [customers] = useState([
    { id: 1, name: 'Nguyễn Văn A', phone: '0901234567' },
    { id: 2, name: 'Trần Thị B', phone: '0902345678' },
  ])

  useEffect(() => {
    loadProducts()
  }, [filterType])

  // Thêm tab khách hàng mới
  const addTab = () => {
    const newKey = `${tabs.length + 1}`
    setTabs([
      ...tabs,
      {
        key: newKey,
        title: `Khách hàng ${newKey}`,
        customerInfo: { name: '', phone: '' },
        products: [],
      },
    ])
    setActiveKey(newKey)
  }

  // Xóa tab khách hàng
  const removeTab = (targetKey) => {
    const newTabs = tabs.filter((tab) => tab.key !== targetKey)
    setTabs(newTabs)
    if (newTabs.length > 0) setActiveKey(newTabs[0].key)
  }

  // Cập nhật thông tin khách hàng
  const updateCustomerInfo = (key, field, value) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.key === key
          ? { ...tab, customerInfo: { ...tab.customerInfo, [field]: value } }
          : tab
      )
    )
  }

  // Xử lý chọn sản phẩm và thêm vào hóa đơn
  const handleAddProduct = () => {
    if (!selectedVariant) {
      return
    }

    setTabs((prevTabs) =>
      prevTabs.map((tab) => {
        if (tab.key !== activeKey) return tab

        const existingProductIndex = tab.products.findIndex(
          (item) =>
            item.id === selectedProduct.id &&
            item.variant.variantId === selectedVariant.variantId
        )

        if (existingProductIndex !== -1) {
          // Nếu sản phẩm đã tồn tại, tăng số lượng
          const updatedProducts = [...tab.products]
          updatedProducts[existingProductIndex].quantity += 1
          return {
            ...tab,
            products: updatedProducts,
          }
        } else {
          // Nếu sản phẩm chưa tồn tại, thêm mới
          return {
            ...tab,
            products: [
              ...tab.products,
              { ...selectedProduct, variant: selectedVariant, quantity: 1 },
            ],
          }
        }
      })
    )

    setModalVisible(false)
    setSelectedProduct(null)
    setSelectedVariant(null)
  }

  // Hiển thị modal để chọn biến thể sản phẩm
  const showProductModal = (product) => {
    setSelectedProduct(product)
    setModalVisible(true)
  }

  // Tính tổng tiền hóa đơn
  const calculateTotal = (products) => {
    return products.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    )
  }

  // Xử lý chọn khách hàng từ danh sách có sẵn
  const handleCustomerSelect = (key, customerId) => {
    const customer = customers.find((c) => c.id === customerId)
    updateCustomerInfo(key, 'name', customer.name)
    updateCustomerInfo(key, 'phone', customer.phone)
  }

  // Hàm để lấy danh sách sản phẩm từ API
  const loadProducts = async () => {
    try {
      const response = await fetchProducts({}, filterType) // Pass filters as a parameter to the API
      setProducts(response.data)
    } catch (error) {
      message.error('Lỗi khi tải sản phẩm')
    }
  }

  // Tạo giao diện nhập thông tin khách hàng
  const renderCustomerForm = (tab) => (
    <div>
      <h3 className="font-bold text-lg mb-2">Thông tin khách hàng</h3>
      <Switch
        checked={!isSearching}
        onChange={() => setIsSearching(!isSearching)}
        checkedChildren="Thêm mới"
        unCheckedChildren="Tìm kiếm"
        className="mb-4"
      />
      {isSearching ? (
        <Select
          className="w-full mb-4"
          placeholder="Tìm khách hàng"
          onChange={(customerId) => handleCustomerSelect(tab.key, customerId)}
          allowClear
        >
          {customers.map((customer) => (
            <Option key={customer.id} value={customer.id}>
              {customer.name} - {customer.phone}
            </Option>
          ))}
        </Select>
      ) : (
        <div>
          <Form layout="vertical">
            <Form.Item label="Tên khách hàng">
              <Input
                placeholder="Nhập tên khách hàng"
                value={tab.customerInfo.name}
                onChange={(e) =>
                  updateCustomerInfo(tab.key, 'name', e.target.value)
                }
              />
            </Form.Item>
            <Form.Item label="Số điện thoại">
              <Input
                placeholder="Nhập số điện thoại"
                value={tab.customerInfo.phone}
                onChange={(e) =>
                  updateCustomerInfo(tab.key, 'phone', e.target.value)
                }
              />
            </Form.Item>
          </Form>
        </div>
      )}
    </div>
  )

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-4">
        <Tabs
          type="editable-card"
          activeKey={activeKey}
          onChange={setActiveKey}
          onEdit={(targetKey, action) => {
            if (action === 'add') addTab()
            else removeTab(targetKey)
          }}
        >
          {tabs.map((tab) => (
            <TabPane
              key={tab.key}
              tab={
                tab.customerInfo.name ? `${tab.customerInfo.name}` : tab.title
              }
            >
              <div className="grid grid-cols-3 gap-4">
                {/* Khu vực sản phẩm bên trái */}
                <div className="col-span-2 border-r pr-4">
                  <Tabs defaultActiveKey="1">
                    <TabPane tab="Sản phẩm" key="1">
                      <div className="mb-4">
                        <Radio.Group
                          value={filterType}
                          onChange={(e) => setFilterType(e.target.value)}
                          className="mb-4"
                        >
                          <Radio.Button value="product">Quần áo</Radio.Button>
                          <Radio.Button value="accessory">
                            Phụ kiện
                          </Radio.Button>
                        </Radio.Group>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {products.map((product) => (
                          <ProductOrderCard
                            key={product.id}
                            onClick={() => showProductModal(product)}
                            product={product}
                          />
                        ))}
                      </div>
                    </TabPane>
                  </Tabs>
                </div>

                {/* Khu vực hóa đơn bên phải */}
                <div className="col-span-1 pl-4">
                  {renderCustomerForm(tab)}

                  <Divider />

                  <h3 className="font-bold text-lg mb-4">Chi tiết hóa đơn</h3>
                  <div>
                    {tab.products.map((item, index) => (
                      <div key={index} className="flex items-center mb-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded mr-4"
                        />
                        <div className="flex-1">
                          <p className="font-bold">{item.name}</p>
                          <p>
                            Biến thể: {item.variant.name} - Số lượng:{' '}
                            {item.quantity}
                          </p>
                          <p>Giá: {item.price.toLocaleString()} VND</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Divider />
                  <p>
                    <strong>Tổng tiền: </strong>
                    {calculateTotal(tab.products).toLocaleString()} VND
                  </p>
                  <Button
                    type="primary"
                    className="mt-4 w-full"
                    disabled={!tab.customerInfo.name || !tab.customerInfo.phone}
                  >
                    Xác nhận hóa đơn
                  </Button>
                </div>
              </div>
            </TabPane>
          ))}
        </Tabs>
      </div>

      {/* Modal chọn biến thể sản phẩm */}
      <Modal
        title={`Chọn size cho sản phẩm`}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleAddProduct}
        okButtonProps={{ disabled: !selectedVariant }}
      >
        <Form layout="vertical">
          <Form.Item label="Chọn size">
            <Select
              placeholder="Chọn size"
              onChange={(variantId) =>
                setSelectedVariant(
                  selectedProduct.variants.find(
                    (variant) => variant.variantId === variantId
                  )
                )
              }
              className="w-full"
            >
              {selectedProduct?.variants.map((variant) => (
                <Option key={variant.variantId} value={variant.variantId}>
                  {variant.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default InvoicePage
