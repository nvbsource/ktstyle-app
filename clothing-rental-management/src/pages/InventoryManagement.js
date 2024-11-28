import React, { useEffect, useState } from 'react'
import {
  AppstoreOutlined,
  EditOutlined,
  HistoryOutlined,
} from '@ant-design/icons'
import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Table,
  Select,
} from 'antd'
import InventoryFilter from '../components/InventoryFilter'
import {
  fetchInventories,
  addInventory,
  updateStatusInventory,
} from '../services/inventoryApi'
import { formatDate } from '../helpers/helpers'
import dayjs from 'dayjs'

const { Option } = Select

const InventoryManagement = () => {
  const [inventories, setInventories] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false)
  const [loading, setLoading] = useState(true)
  const [editingInventory, setEditingInventory] = useState(null)
  const [inventoryHistory, setInventoryHistory] = useState([])
  const [form] = Form.useForm()
  const [transactionType, setTransactionType] = useState('import') // State để lưu loại giao dịch
  const [selectedSource, setSelectedSource] = useState('') // Giá trị của Select
  const [newImportSource, setNewImportSource] = useState('') // Giá trị của Input
  const [importSources, setImportSources] = useState([
    'shopee',
    'tiktok',
    'facebook',
    'instagram',
  ]) // Danh sách nguồn

  const handleAddImportSource = () => {
    // Kiểm tra giá trị mới và thêm vào danh sách nếu chưa tồn tại
    if (newImportSource && !importSources.includes(newImportSource)) {
      setImportSources((prevSources) => [...prevSources, newImportSource]) // Thêm nguồn mới
      message.success(`Nguồn nhập "${newImportSource}" đã được thêm.`)
      setSelectedSource(newImportSource) // Cập nhật giá trị Select
    } else if (!newImportSource.trim()) {
      message.warning('Vui lòng nhập nguồn hợp lệ.') // Xử lý trường hợp nhập rỗng
    } else {
      setSelectedSource(newImportSource) // Cập nhật giá trị Select
      message.info('Nguồn này đã tồn tại.') // Tránh thêm trùng lặp
    }
    setNewImportSource('') // Reset Input
  }

  const loadInventories = async () => {
    setLoading(true)

    try {
      const response = await fetchInventories()
      setInventories(response.data)
    } catch (error) {
      message.error('Lỗi khi tải kho hàng')
    }
    setLoading(false)
  }

  const loadInventoryHistory = async (inventoryId) => {
    try {
      // const response = await fetchInventoryHistory(inventoryId)
      // setInventoryHistory(response.data)
    } catch (error) {
      message.error('Lỗi khi tải lịch sử kho hàng')
    }
  }

  useEffect(() => {
    loadInventories()
  }, [])

  useEffect(() => {
    if (editingInventory) {
      form.setFieldsValue({
        name: editingInventory.name,
        phone: editingInventory.phone,
        dob: editingInventory.dob ? dayjs(editingInventory.dob) : null,
      })
    }
  }, [editingInventory])

  const handleEditInventory = (inventory) => {
    setEditingInventory(inventory)
    setIsModalVisible(true)
  }

  const handleHistoryClick = (inventory) => {
    loadInventoryHistory(inventory.id)
    setIsHistoryModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    setEditingInventory(null)
  }

  const handleHistoryModalCancel = () => {
    setIsHistoryModalVisible(false)
  }

  const handleFormSubmit = async (values) => {
    try {
      const formattedValues = {
        ...values,
        dob: values.dob ? values.dob.format('YYYY-MM-DD') : null,
      }
      // const data = await updateInventory(editingInventory.id, formattedValues)
      // message.success(data.message)
      loadInventories()
      handleCancel()
    } catch (error) {
      message.error(error.response?.data?.message)
    }
  }

  const handleStatusChange = async (inventoryId, newStatus) => {
    try {
      const data = await updateStatusInventory(inventoryId, {
        status: newStatus,
      })
      message.success(data.message)
      loadInventories()
    } catch (error) {
      message.error(error.response?.data?.message)
    }
  }

  const columns = [
    {
      title: 'Mã kho',
      dataIndex: 'id',
      key: 'id',
      render: (text) => `${text}`,
    },
    {
      title: 'Mã sảm phẩm',
      dataIndex: 'product_id',
      key: 'product_id',
      render: (text) => `${text}`,
    },
    { title: 'Tên sản phẩm', dataIndex: 'product_name', key: 'product_name' },
    {
      title: 'Biến thể',
      dataIndex: 'variant',
      key: 'variant',
      render: (_, data) => `${data.variant_color}, ${data.variant_size}`,
    },
    {
      title: 'Số lượng tồn',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        const statusMap = {
          available: 'Sẵn sàng',
          unavailable: 'Không sẵn sàng',
        }
        return statusMap[text]
      },
    },
    {
      title: 'Ngày tạo kho',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => (text ? formatDate(text) : 'Chưa cập nhật'),
    },
    {
      title: 'Ngày cập nhật kho',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (text) => (text ? formatDate(text) : 'Chưa cập nhật'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <div>
          <Select
            defaultValue={record.status}
            onChange={(value) => handleStatusChange(record.id, value)}
            style={{ width: 150 }}
          >
            <Option value="available">Sẵn sàng</Option>
            <Option value="unavailable">Không sẵn sàng</Option>
          </Select>
          <Button
            icon={<HistoryOutlined />}
            onClick={() => handleHistoryClick(record)}
            style={{ marginLeft: 8 }}
          >
            Lịch sử
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="p-8 bg-white rounded-md">
      <div className="flex flex-col md:flex-row mb-8">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <AppstoreOutlined className="text-3xl" />
          <h2 className="text-2xl font-semibold">Quản lý kho hàng</h2>
        </div>
      </div>

      <InventoryFilter
        setLoading={setLoading}
        setInventories={setInventories}
      />

      <Table
        dataSource={inventories}
        columns={columns}
        rowKey="id"
        loading={loading}
        scroll={{ x: 'max-content' }}
      />

      <Modal
        title="Sửa thông tin kho hàng"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={1200}
      >
        <Form form={form} onFinish={handleFormSubmit} layout="vertical">
          <Form.Item
            label="Tên kho hàng"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên kho hàng' }]}
          >
            <Input placeholder="Nhập tên kho hàng" />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            label="Sinh nhật"
            name="dob"
            rules={[{ required: true, message: 'Vui lòng nhập sinh nhật' }]}
          >
            <DatePicker format="DD/MM/YYYY" />
          </Form.Item>

          <Button type="primary" htmlType="submit" style={{ marginTop: 16 }}>
            Cập nhật
          </Button>
        </Form>
      </Modal>

      <Modal
        title="Lịch sử cập nhật kho hàng"
        visible={isHistoryModalVisible}
        onCancel={handleHistoryModalCancel}
        footer={null}
        width={1200}
      >
        <Table
          dataSource={inventoryHistory}
          columns={[
            { title: 'Ngày', dataIndex: 'date', key: 'date' },
            { title: 'Hành động', dataIndex: 'action', key: 'action' },
            { title: 'Người thực hiện', dataIndex: 'user', key: 'user' },
          ]}
          rowKey="id"
        />
        <Form layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            label="Loại giao dịch"
            name="transactionType"
            rules={[
              { required: true, message: 'Vui lòng chọn loại giao dịch' },
            ]}
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
                rules={[
                  { required: true, message: 'Vui lòng chọn nguồn nhập' },
                ]}
              >
                <Select
                  placeholder="Chọn nguồn nhập hoặc nhập mới"
                  value={selectedSource} // Giá trị hiện tại của Select
                  onChange={(value) => setSelectedSource(value)} // Cập nhật giá trị khi chọn từ Option
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
                          value={newImportSource} // Giá trị của Input thêm mới
                          onChange={(e) => setNewImportSource(e.target.value)} // Cập nhật giá trị Input
                          placeholder="Nhập nguồn mới"
                        />
                        <Button type="link" onClick={handleAddImportSource}>
                          Thêm
                        </Button>
                      </div>
                    </>
                  )}
                >
                  {importSources.map((source) => (
                    <Option key={source} value={source}>
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

          <Button type="primary" style={{ marginTop: 16 }}>
            Cập nhật kho
          </Button>
        </Form>
      </Modal>
    </div>
  )
}

export default InventoryManagement
