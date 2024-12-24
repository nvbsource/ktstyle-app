import { DatePicker, Input, Select, Switch } from 'antd'
import React, { useEffect, useState } from 'react'
const { RangePicker } = DatePicker
const { Option } = Select

const InventoryFilter = ({
  setIsCardView,
  isCardView,
  itemType,
  filters,
  setFilters,
  loadInventories
}) => {
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
    loadInventories(filters, itemType)
  }, [debouncedFilters, itemType])

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
        {itemType === 'product' && (
          <>
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
          </>
        )}
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
            <Option value="available">Sẵn sàng</Option>
            <Option value="unavailable">Không sẵn sàng</Option>
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
      {/* Card View Toggle */}
      <div className="flex items-center mt-4 sm:mt-0">
        <Switch
          checked={isCardView}
          onChange={() => setIsCardView(!isCardView)}
          className="mr-3"
        />
        <span className="text-sm">Xem dưới dạng Card</span>
      </div>
    </div>
  )
}

export default InventoryFilter
