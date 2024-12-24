import {
  AppstoreOutlined,
  FrownOutlined,
  HistoryOutlined,
} from '@ant-design/icons'
import { Button, Col, message, Modal, Row, Select, Switch, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import InventoryFilter from '../components/InventoryFilter'
import InventoryHistory from '../components/InventoryHistory'
import { formatDate } from '../helpers/helpers'
import {
  fetchInventories,
  updateStatusInventory,
} from '../services/inventoryApi'
import InventoryCard from '../components/InventoryCard'

const { Option } = Select

const InventoryManagement = () => {
  const [inventories, setInventories] = useState([])
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedInventory, setSelectedInventory] = useState(null)
  const [isCardView, setIsCardView] = useState(true) // Kiểm tra chế độ hiển thị: Table or Card
  const [itemType, setItemType] = useState('product')
  const [filters, setFilters] = useState({
    inventory_id: '',
    product_id: '',
    product_name: '',
    size: '',
    color: '',
    status: '', // Thêm trạng thái vào filters
    date_update: [],
  })

  const loadInventories = async () => {
    setLoading(true)

    try {
      const response = await fetchInventories(filters, itemType)
      setInventories(response.data)
    } catch (error) {
      message.error('Lỗi khi tải kho hàng')
    }
    setLoading(false)
  }

  useEffect(() => {
    loadInventories()
  }, [])

  const handleHistoryClick = (inventory) => {
    setSelectedInventory(inventory)
    setIsHistoryModalVisible(true)
  }

  const handleHistoryModalCancel = () => {
    setIsHistoryModalVisible(false)
    setSelectedInventory(null)
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

  const renderInventoryCards = () => {
    return (
      <Row gutter={[16, 16]}>
        {inventories.map((inventory) => (
          <Col
            key={inventory.id}
            xs={24}
            sm={12}
            md={8}
            lg={6}
            xl={4} // Responsive cột theo kích thước màn hình
          >
            <InventoryCard
              itemType={itemType}
              inventory={inventory}
              handleShowDetail={() => handleHistoryClick(inventory)}
              handleStatusChange={(value) =>
                handleStatusChange(inventory.id, value)
              }
            />
          </Col>
        ))}
        {inventories.length === 0 && (
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

  const getTypeName = () => (itemType === 'product' ? 'Sản phẩm' : 'Phụ kiện')

  return (
    <div className="p-8 bg-white rounded-md">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <AppstoreOutlined className="text-3xl" />
          <h2 className="text-2xl font-semibold">
            Quản lý kho {getTypeName()}
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
        <Button type="primary">Khách thuê mới</Button>
      </div>

      <InventoryFilter
        setIsCardView={setIsCardView}
        isCardView={isCardView}
        itemType={itemType}
        setFilters={setFilters}
        filters={filters}
        loadInventories={loadInventories}
      />

      {isCardView ? (
        renderInventoryCards()
      ) : (
        <Table
          dataSource={inventories}
          columns={columns}
          rowKey="id"
          loading={loading}
          scroll={{ x: 'max-content' }}
        />
      )}

      {selectedInventory && (
        <Modal
          title="Lịch sử cập nhật kho hàng"
          visible={isHistoryModalVisible}
          onCancel={handleHistoryModalCancel}
          footer={null}
          width={1200}
        >
          <InventoryHistory
            inventory={selectedInventory}
            loadInventories={loadInventories}
          />
        </Modal>
      )}
    </div>
  )
}

export default InventoryManagement
