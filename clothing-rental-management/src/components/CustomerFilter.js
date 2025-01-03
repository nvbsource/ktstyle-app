import { DatePicker, Input, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { fetchCustomers } from '../services/customerApi' // Giả sử fetchCustomers là API gọi khách hàng
const { RangePicker } = DatePicker

const CustomerFilter = ({ setLoading, setCustomers }) => {
  const [filters, setFilters] = useState({
    name: '',
    phone: '',
    dob: '',
    date: [],
  })

  const [debouncedFilters, setDebouncedFilters] = useState(filters)
  const [debounceTimeout, setDebounceTimeout] = useState(null)

  useEffect(() => {
    // Hủy bỏ timeout cũ nếu có
    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
    }

    // Tạo timeout mới
    const timeout = setTimeout(() => {
      setDebouncedFilters(filters)
    }, 300) // Delay 300ms sau khi user ngừng thay đổi filter

    // Lưu timeout id để có thể hủy bỏ sau
    setDebounceTimeout(timeout)
  }, [filters])

  // Effect to call loadCustomers when filters change
  useEffect(() => {
    loadCustomers()
  }, [debouncedFilters]) // Khi filter thay đổi sẽ gọi lại API

  // Hàm xử lý thay đổi của tên
  const handleNameFilterChange = (e) => {
    const value = e.target.value
    setFilters((prevFilters) => ({
      ...prevFilters,
      name: value,
    }))
  }
  const handlePhoneFilterChange = (e) => {
    const value = e.target.value
    setFilters((prevFilters) => ({
      ...prevFilters,
      phone: value,
    }))
  }
  const handleDOBFilterChange = (dates) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      dob: dates,
    }))
  }

  // Hàm xử lý thay đổi của date
  const handleDateFilterChange = (dates) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      date: dates,
    }))
  }

  // Hàm gọi API để lấy dữ liệu với các bộ lọc
  const loadCustomers = async () => {
    setLoading(true)
    try {
      const response = await fetchCustomers(filters) // Pass filters as a parameter to the API
      setCustomers(response.data)
    } catch (error) {
      message.error('Lỗi khi tải khách hàng')
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-wrap justify-between mb-4 gap-4">
      <div className="flex gap-4 flex-wrap w-full sm:w-auto">
        {/* Name Filter */}
        <div className="flex flex-col w-full sm:w-48">
          <label className="mb-2 text-sm font-medium text-gray-700">
            Tìm tên khách hàng
          </label>
          <Input
            placeholder="Tìm tên khách hàng"
            value={filters.name}
            onChange={handleNameFilterChange}
            className="w-full"
          />
        </div>
        <div className="flex flex-col w-full sm:w-48">
          <label className="mb-2 text-sm font-medium text-gray-700">
            Tìm số điện thoại
          </label>
          <Input
            placeholder="Tìm số điện thoại"
            value={filters.phone}
            onChange={handlePhoneFilterChange}
            className="w-full"
          />
        </div>

        <div className="flex flex-col w-full sm:w-48">
          <label className="mb-2 text-sm font-medium text-gray-700">
            Tìm ngày sinh nhật
          </label>
          <DatePicker
            format="DD/MM/YYYY"
            placeholder="Chọn ngày sinh nhật"
            className="w-full"
            value={filters.dob}
            onChange={handleDOBFilterChange}
          />
        </div>

        {/* Date Filter */}
        <div className="flex flex-col w-full sm:w-72">
          <label className="mb-2 text-sm font-medium text-gray-700">
            Lọc theo ngày tham gia
          </label>
          <RangePicker onChange={handleDateFilterChange} className="w-full" />
        </div>
      </div>
    </div>
  )
}

export default CustomerFilter
