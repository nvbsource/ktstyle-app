import { DatePicker, Input, message, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { fetchInventories } from '../services/inventoryApi' // Giả sử fetchInventories là API gọi khách hàng
const { RangePicker } = DatePicker
const { Option } = Select

const InventoryFilter = ({ setLoading, setInventories }) => {
  const [filters, setFilters] = useState({
    inventory_id: '',
    product_id: '',
    product_name: '',
    size: '',
    color: '',
    status: '', // Thêm trạng thái vào filters
    date_update: [],
  })

  const [debouncedFilters, setDebouncedFilters] = useState(filters)
  const [debounceTimeout, setDebounceTimeout] = useState(null)

  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
    }

    const timeout = setTimeout(() => {
      setDebouncedFilters(filters)
    }, 300)

    setDebounceTimeout(timeout)
  }, [filters])

  useEffect(() => {
    loadInventories()
  }, [debouncedFilters])

  const handleProductNameFilterChange = (e) => {
    const value = e.target.value
    setFilters((prevFilters) => ({
      ...prevFilters,
      product_name: value,
    }))
  }
  const handleProductIdFilterChange = (e) => {
    const value = e.target.value
    setFilters((prevFilters) => ({
      ...prevFilters,
      product_id: value,
    }))
  }
  const handleInventoryIdFilterChange = (e) => {
    const value = e.target.value
    setFilters((prevFilters) => ({
      ...prevFilters,
      inventory_id: value,
    }))
  }

  const handleSizeFilterChange = (e) => {
    const value = e.target.value
    setFilters((prevFilters) => ({
      ...prevFilters,
      size: value,
    }))
  }
  const handleColorFilterChange = (e) => {
    const value = e.target.value
    setFilters((prevFilters) => ({
      ...prevFilters,
      color: value,
    }))
  }

  const handleDateFilterChange = (dates) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      date_update: dates,
    }))
  }

  // Hàm xử lý thay đổi của trạng thái
  const handleStatusFilterChange = (value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      status: value,
    }))
  }

  const loadInventories = async () => {
    setLoading(true)
    try {
      const response = await fetchInventories(filters)
      setInventories(response.data)
    } catch (error) {
      message.error('Lỗi khi tải khách hàng')
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-wrap justify-between mb-4 gap-4">
      <div className="flex gap-4 flex-wrap w-full sm:w-auto">
        {/* ID Filter */}
        <div className="flex flex-col w-full sm:w-48">
          <label className="mb-2 text-sm font-medium text-gray-700">
            Tìm mã kho
          </label>
          <Input
            placeholder="Tìm mã kho"
            value={filters.inventory_id}
            onChange={handleInventoryIdFilterChange}
            className="w-full"
          />
        </div>
        {/* Product ID Filter */}
        <div className="flex flex-col w-full sm:w-48">
          <label className="mb-2 text-sm font-medium text-gray-700">
            Tìm mã sản phẩm
          </label>
          <Input
            placeholder="Tìm mã sản phẩm"
            value={filters.product_id}
            onChange={handleProductIdFilterChange}
            className="w-full"
          />
        </div>
        {/* Name Filter */}
        <div className="flex flex-col w-full sm:w-48">
          <label className="mb-2 text-sm font-medium text-gray-700">
            Tìm tên sản phẩm
          </label>
          <Input
            placeholder="Tìm tên sản phẩm"
            value={filters.product_name}
            onChange={handleProductNameFilterChange}
            className="w-full"
          />
        </div>
        {/* Color Filter */}
        <div className="flex flex-col w-full sm:w-48">
          <label className="mb-2 text-sm font-medium text-gray-700">
            Tìm theo màu
          </label>
          <Input
            placeholder="Tìm theo màu"
            value={filters.color}
            onChange={handleColorFilterChange}
            className="w-full"
          />
        </div>
        {/* Size Filter */}
        <div className="flex flex-col w-full sm:w-48">
          <label className="mb-2 text-sm font-medium text-gray-700">
            Tìm kích thướt
          </label>
          <Input
            placeholder="Tìm theo kích thướt"
            value={filters.size}
            onChange={handleSizeFilterChange}
            className="w-full"
          />
        </div>
        {/* Status Filter */}
        <div className="flex flex-col w-full sm:w-48">
          <label className="mb-2 text-sm font-medium text-gray-700">
            Tìm trạng thái
          </label>
          <Select
            placeholder="Chọn trạng thái"
            value={filters.status}
            onChange={handleStatusFilterChange}
            className="w-full"
          >
            <Option value="">Tất cả</Option>
            <Option value="available">Sẵn có</Option>
            <Option value="rented">Đang cho thuê</Option>
            <Option value="out_of_stock">Hết hàng</Option>
          </Select>
        </div>
        {/* Date Filter */}
        <div className="flex flex-col w-full sm:w-72">
          <label className="mb-2 text-sm font-medium text-gray-700">
            Lọc theo ngày cập nhật
          </label>
          <RangePicker onChange={handleDateFilterChange} className="w-full" />
        </div>
      </div>
    </div>
  )
}

export default InventoryFilter
