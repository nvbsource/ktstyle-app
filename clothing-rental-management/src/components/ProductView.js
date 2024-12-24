import { Button, Col, Divider, message, Row, Table, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import { formatNumberToCurrency } from '../helpers/helpers'
import { fetchVariants } from '../services/api'

export default function ProductView({
  selectedProduct,
  editProduct,
  itemType,
}) {
  const [variants, setVariants] = useState([]) // State lưu biến thể
  const [loadingVariant, setLoadingVariant] = useState(false)
  useEffect(() => {
    if (selectedProduct) {
      loadVariants()
    }
  }, [selectedProduct])

  const loadVariants = async () => {
    setLoadingVariant(true)
    if (selectedProduct && selectedProduct?.id) {
      try {
        const response = await fetchVariants(selectedProduct.id) // Pass filters as a parameter to the API
        setVariants(response.data)
      } catch (error) {
        message.error('Lỗi khi tải biến thể')
      }
    }
    setLoadingVariant(false)
  }
  return (
    <>
      <Row gutter={24} className="border rounded-md">
        {/* Cột bên trái cho thông tin sản phẩm */}
        <Col xs={24} md={12} className="border-r border-gray-200">
          <div>
            <Row className="p-3 text-gray-600 rounded-xl mb-2">
              <Col span={6}>
                <strong className="text-lg">Tên sản phẩm:</strong>
              </Col>
              <Col span={18} className="text-lg">
                {selectedProduct.name}
              </Col>
            </Row>
            <Row className="p-3 text-gray-600 rounded-xl mb-2">
              <Col span={6}>
                <strong className="text-lg">Mô tả:</strong>
              </Col>
              <Col span={18} className="text-lg">
                {selectedProduct.description || 'Không có mô tả'}
              </Col>
            </Row>
            <Row className="p-3 text-gray-600 rounded-xl mb-2">
              <Col span={6}>
                <strong className="text-lg">Danh mục:</strong>
              </Col>
              <Col span={18} className="text-lg">
                {selectedProduct.category?.name || `Chưa cập nhật`}
              </Col>
            </Row>
            {itemType === 'product' && (
              <Row className="p-3 text-gray-600 rounded-xl mb-2">
                <Col span={6}>
                  <strong className="text-lg">Thư viện:</strong>
                </Col>
                <Col span={18} className="text-lg">
                  {selectedProduct.libraries.length > 0
                    ? selectedProduct.libraries
                        .map((library) => library.name)
                        .join(', ')
                    : 'Không có thư viện'}
                </Col>
              </Row>
            )}
            <Row className="p-3 text-gray-600 rounded-xl mb-2">
              <Col span={6}>
                <strong className="text-lg">Giá nhập:</strong>
              </Col>
              <Col span={18} className="text-lg font-bold">
                {formatNumberToCurrency(selectedProduct.import_price)} VND
              </Col>
            </Row>
            <Row className="bg-gray-100 p-3 text-gray-600 rounded-xl">
              <Col span={6}>
                <strong className="text-lg">Giá thuê:</strong>
              </Col>
              <Col span={18} className="text-2xl font-bold">
                {formatNumberToCurrency(selectedProduct.rental_price)} VND
              </Col>
            </Row>
            {itemType === 'product' && (
              <>
                <Divider />
                <h1 class="text-xl font-bold mt-5">Biến thể sản phẩm</h1>
                <Row gutter={16} className="mt-3">
                  <Col span={24}>
                    <Table
                      dataSource={variants}
                      loading={loadingVariant}
                      columns={[
                        {
                          title: 'Id',
                          dataIndex: 'id',
                          key: 'id',
                        },
                        {
                          title: 'Size',
                          dataIndex: 'size',
                          key: 'size',
                        },
                        {
                          title: 'Màu',
                          dataIndex: 'color',
                          key: 'color',
                        },
                        {
                          title: 'Số lượng tồn trong kho',
                          dataIndex: 'quantity',
                          key: 'quantity',
                        },
                      ]}
                      rowKey={(record, index) => index}
                    />
                  </Col>
                </Row>
              </>
            )}
          </div>
        </Col>
        {/* Cột bên phải cho ảnh sản phẩm */}
        <Col xs={24} md={12} className="bg-white">
          <div className="p-0 pt-2">
            <div className="h-[700px] overflow-auto">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {selectedProduct.images.map((image, index) => (
                  <img
                    key={index}
                    alt={`product-image-${index}`}
                    src={image}
                    style={{
                      width: `${selectedProduct.images.length <= 3 ? `calc(${100 / selectedProduct.images.length}% - 5px)` : 'calc(33.33% - 10px)'} `,
                      height: 'auto',
                      borderRadius: '8px',
                      objectFit: 'cover',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Nút chỉnh sửa sản phẩm */}
      <div
        style={{
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Button
          type="primary"
          onClick={() => editProduct(selectedProduct)}
          style={{ marginRight: '10px' }}
        >
          Chỉnh sửa sản phẩm
        </Button>
      </div>
    </>
  )
}
