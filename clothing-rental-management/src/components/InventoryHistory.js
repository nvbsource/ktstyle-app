import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  message,
  Row,
  Select,
  Table,
} from 'antd'
import { Option } from 'antd/es/mentions'
import React, { useEffect, useState } from 'react'
import {
  fetchInventoryHistory,
  submitInventory,
} from '../services/inventoryApi'
import { MessageFilled } from '@ant-design/icons'
import { formatDate, formatNumberToCurrency } from '../helpers/helpers'

export default function InventoryHistory({ inventory, loadInventories }) {
  const [form] = Form.useForm()
  const [inventoryHistory, setInventoryHistory] = useState([])
  const [transactionType, setTransactionType] = useState('import') // State để lưu loại giao dịch
  const [newImportSource, setNewImportSource] = useState('') // Giá trị của Input
  const [importSources, setImportSources] = useState([
    'shopee',
    'tiktok',
    'facebook',
    'instagram',
  ]) // Danh sách nguồn

  const initialValues = {
    transactionType: 'import',
    importQuantity: 0,
    importAmount: 0,
    exportQuantity: 0,
    exportAmount: 0,
    exportNote: '',
  }

  useEffect(() => {
    loadInventoryHistory(inventory.id)
  }, [inventory])

  const loadInventoryHistory = async (inventoryId) => {
    try {
      const response = await fetchInventoryHistory(inventoryId)
      setInventoryHistory(response.data)
    } catch (error) {
      message.error('Lỗi khi tải lịch sử kho hàng')
    }
  }

  const handleSubmit = async (values) => {
    try {
      const data = {
        transaction_type: transactionType,
        quantity:
          transactionType === 'import'
            ? values.importQuantity
            : values.exportQuantity,
        amount:
          transactionType === 'import'
            ? values.importAmount
            : values.exportAmount,
        source: transactionType === 'import' ? values.source : undefined,
        note: transactionType === 'export' ? values.exportNote : undefined,
      }
      await submitInventory(inventory.id, data)
      loadInventoryHistory(inventory.id)
      loadInventories()
      form.resetFields()
      message.success('Cập nhật kho thành công.')
    } catch (error) {
      console.log('Lỗi khi cập nhật kho:', error)

      message.error(error.response?.data?.message)
    }
  }

  const handleAddImportSource = () => {
    if (newImportSource && !importSources.includes(newImportSource)) {
      setImportSources((prevSources) => [...prevSources, newImportSource])
      message.success(`Nguồn nhập "${newImportSource}" đã được thêm.`)
      form.setFieldValue('source', newImportSource)
    } else if (!newImportSource.trim()) {
      message.warning('Vui lòng nhập nguồn hợp lệ.')
    } else {
      form.setFieldValue('source', newImportSource)
      message.info('Nguồn này đã tồn tại.')
    }
    setNewImportSource('')
  }

  return (
    <>
      <Row>
        {/* Cột 1: Thông tin sản phẩm */}
        <Col xs={24} md={12}>
          <div className="pr-4">
            <Row className="p-3 text-gray-600 rounded-xl mb-2">
              <Col span={6}>
                <strong className="text-lg">Tên sản phẩm:</strong>
              </Col>
              <Col span={18} className="text-lg">
                {inventory.product_name}
              </Col>
            </Row>
            <Row className="p-3 text-gray-600 rounded-xl mb-2">
              <Col span={6}>
                <strong className="text-lg">Số lượng tồn kho:</strong>
              </Col>
              <Col span={18} className="text-lg">
                {inventory.quantity}
              </Col>
            </Row>
            <Row className="bg-gray-100 p-3 text-gray-600 rounded-xl">
              <Col span={6}>
                <strong className="text-lg">Giá nhập:</strong>
              </Col>
              <Col span={18} className="text-2xl font-bold">
                {formatNumberToCurrency(inventory.import_price)} VND
              </Col>
            </Row>
            <Row className="bg-gray-100 p-3 text-gray-600 rounded-xl mt-3">
              <Col span={6}>
                <strong className="text-lg">Giá thuê:</strong>
              </Col>
              <Col span={18} className="text-2xl font-bold">
                {formatNumberToCurrency(inventory.rental_price)} VND
              </Col>
            </Row>
          </div>
        </Col>

        {/* Cột 2: Danh sách hình ảnh */}
        <Col xs={24} md={12}>
          <div
            className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 shadow p-3 mt-3"
            style={{
              minHeight: '250px', // Giới hạn chiều dài
              maxHeight: '250px', // Giới hạn chiều cao
              overflowY: 'auto', // Cuộn dọc nếu quá nhiều hình ảnh
            }}
          >
            {inventory.product_images && inventory.product_images.length > 0 ? (
              inventory.product_images.map((image, index) => (
                <div
                  key={index}
                  className="w-40 h-40 flex-shrink-0 border border-gray-300 rounded-lg overflow-hidden"
                >
                  <img
                    src={image}
                    alt={`Product Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-400">Không có hình ảnh nào</p>
            )}
          </div>
        </Col>
      </Row>
      <Divider />
      <h3 className="text-lg font-bold mb-2 text-center">
        Lịch sử thay đổi kho sản phẩm
      </h3>
      <Table
        dataSource={inventoryHistory}
        columns={[
          {
            title: 'Ngày',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (value) => formatDate(value),
          },
          {
            title: 'Giao dịch',
            dataIndex: 'transaction_type',
            key: 'transaction_type',
            render: (value) => (value === 'import' ? 'Nhập kho' : 'Xuất kho'),
          },
          { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
          {
            title: 'Tồn trước',
            dataIndex: 'quantity_before',
            key: 'quantity_before',
          },
          {
            title: 'Tồn sau',
            dataIndex: 'quantity_after',
            key: 'quantity_after',
          },
          {
            title: 'Số tiền',
            dataIndex: 'amount',
            key: 'amount',
            render: (value) => `${formatNumberToCurrency(value)} VND`,
          },
          { title: 'Nguồn nhập', dataIndex: 'source', key: 'source' },
          { title: 'Ghi chú', dataIndex: 'note', key: 'note' },
        ]}
        rowKey="id"
      />
      <Form
        layout="vertical"
        style={{ marginTop: 16 }}
        onFinish={handleSubmit}
        initialValues={initialValues}
      >
        <Form.Item
          label="Loại giao dịch"
          name="transactionType"
          rules={[{ required: true, message: 'Vui lòng chọn loại giao dịch' }]}
        >
          <Select
            onChange={(value) => setTransactionType(value)}
            placeholder="Chọn loại giao dịch"
          >
            <Option value="import">Nhập kho</Option>
            <Option value="export">Xuất kho</Option>
          </Select>
        </Form.Item>

        {transactionType === 'import' && (
          <>
            <Form.Item
              label="Nguồn nhập"
              name="source"
              rules={[{ required: true, message: 'Vui lòng chọn nguồn nhập' }]}
            >
              <Select
                placeholder="Chọn nguồn nhập hoặc nhập mới"
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'nowrap',
                        padding: 8,
                      }}
                    >
                      <Input
                        style={{ flex: 'auto' }}
                        value={newImportSource}
                        onChange={(e) => setNewImportSource(e.target.value)}
                        placeholder="Nhập nguồn mới"
                      />
                      <Button type="link" onClick={handleAddImportSource}>
                        Thêm
                      </Button>
                    </div>
                  </>
                )}
              >
                {importSources.map((source, index) => (
                  <Option key={index} value={source}>
                    {source}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Số lượng nhập"
              name="importQuantity"
              rules={[
                { required: true, message: 'Vui lòng nhập số lượng nhập' },
              ]}
            >
              <Input placeholder="Nhập số lượng nhập" />
            </Form.Item>
            <Form.Item
              label="Số tiền"
              name="importAmount"
              rules={[{ required: true, message: 'Vui lòng nhập số tiền' }]}
            >
              <Input placeholder="Nhập số tiền" />
            </Form.Item>
          </>
        )}

        {transactionType === 'export' && (
          <>
            <Form.Item
              label="Ghi chú xuất kho"
              name="exportNote"
              rules={[
                { required: true, message: 'Vui lòng nhập ghi chú xuất kho' },
              ]}
            >
              <Input.TextArea placeholder="Nhập ghi chú xuất kho" />
            </Form.Item>
            <Form.Item
              label="Số lượng xuất"
              name="exportQuantity"
              rules={[
                { required: true, message: 'Vui lòng nhập số lượng xuất' },
              ]}
            >
              <Input placeholder="Nhập số lượng xuất" />
            </Form.Item>
            <Form.Item
              label="Số tiền"
              name="exportAmount"
              rules={[{ required: true, message: 'Vui lòng nhập số tiền' }]}
            >
              <Input placeholder="Nhập số tiền" />
            </Form.Item>
          </>
        )}

        <Button type="primary" style={{ marginTop: 16 }} htmlType="submit">
          Cập nhật kho
        </Button>
      </Form>
    </>
  )
}
