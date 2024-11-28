import React, { useState, useEffect } from 'react'
import {
  Input,
  Slider,
  Select,
  Button,
  Switch,
  DatePicker,
  message,
} from 'antd'
import { fetchProducts } from '../services/api' // Giả sử fetchProducts là API gọi sản phẩm
import { flattenObjectArray, formatNumberToCurrency } from '../helpers/helpers'
import { fetchCategories } from '../services/categoryApi'
import { fetchLibraries } from '../services/libraryApi'
const { RangePicker } = DatePicker

const ProductFilter = ({
  setLoading,
  setProducts,
  setIsCardView,
  isCardView,
}) => {
  const [filters, setFilters] = useState({
    name: '',
    category: null,
    library: null,
    price: null,
    date: [],
  })

  const [debouncedFilters, setDebouncedFilters] = useState(filters)
  const [categories, setCategories] = useState([])
  const [libraries, setLibraries] = useState([])

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

  // Effect to call loadProducts when filters change
  useEffect(() => {
    loadProducts()
  }, [debouncedFilters]) // Khi filter thay đổi sẽ gọi lại API

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetchCategories()
        setCategories(flattenObjectArray(response.data))
      } catch (error) {
        message.error('Lỗi khi tải danh mục')
      }
    }
    const loadLibraries = async () => {
      try {
        const response = await fetchLibraries()
        setLibraries(response.data)
      } catch (error) {
        message.error('Lỗi khi tải danh mục')
      }
    }
    loadCategories()
    loadLibraries()
  }, [])

  // Hàm xử lý thay đổi của tên
  const handleNameFilterChange = (e) => {
    const value = e.target.value
    setFilters((prevFilters) => ({
      ...prevFilters,
      name: value,
    }))
  }

  // Hàm xử lý thay đổi của category
  const handleCategoryFilterChange = (value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      category: value,
    }))
  }

  // Hàm xử lý thay đổi của category
  const handleLibraryFilterChange = (value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      library: value,
    }))
  }

  // Hàm xử lý thay đổi của date
  const handleDateFilterChange = (dates) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      date: dates,
    }))
  }

  // Hàm xử lý thay đổi của giá (với debounce)
  const handlePriceFilterChange = (value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      price: value[0] === 0 && value[1] === 10000000 ? null : value,
    }))
  }

  // Hàm gọi API để lấy dữ liệu với các bộ lọc
  const loadProducts = async () => {
    setLoading(true)
    try {
      const response = await fetchProducts(filters) // Pass filters as a parameter to the API
      setProducts(response.data)
    } catch (error) {
      message.error('Lỗi khi tải sản phẩm')
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-wrap justify-between mb-4 gap-4">
      <div className="flex gap-4 flex-wrap w-full sm:w-auto">
        {/* Name Filter */}
        <div className="flex flex-col w-full sm:w-48">
          <label className="mb-2 text-sm font-medium text-gray-700">
            Tìm tên sản phẩm
          </label>
          <Input
            placeholder="Tìm tên sản phẩm"
            value={filters.name}
            onChange={handleNameFilterChange}
            className="w-full"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-col w-full sm:w-48">
          <label className="mb-2 text-sm font-medium text-gray-700">
            Chọn danh mục
          </label>
          <Select
            placeholder="Chọn danh mục"
            value={filters.category}
            onChange={handleCategoryFilterChange}
            className="w-full"
            options={[
              { value: null, label: 'Tất cả danh mục' }, // Option for "All Categories"
              ...categories.map((category) => ({
                value: category.id,
                label: category.name,
              })),
            ]}
          />
        </div>
        {/* Category Filter */}
        <div className="flex flex-col w-full sm:w-48">
          <label className="mb-2 text-sm font-medium text-gray-700">
            Chọn thư viện
          </label>
          <Select
            placeholder="Chọn thư viện"
            value={filters.library}
            onChange={handleLibraryFilterChange}
            className="w-full"
            options={[
              { value: null, label: 'Tất cả thư viện' }, // Option for "All Libraries"
              ...libraries.map((library) => ({
                value: library.id,
                label: library.name,
              })),
            ]}
          />
        </div>

        {/* Date Filter */}
        <div className="flex flex-col w-full sm:w-72">
          <label className="mb-2 text-sm font-medium text-gray-700">
            Lọc theo ngày tải lên
          </label>
          <RangePicker onChange={handleDateFilterChange} className="w-full" />
        </div>

        {/* Price Filter */}
        <div className="flex flex-col w-full sm:w-72">
          <label className="mb-2 text-sm font-medium text-gray-700">
            Lọc theo giá
          </label>
          <Slider
            range
            min={0}
            max={10000000}
            step={10000}
            defaultValue={[0, 10000000]}
            onChange={handlePriceFilterChange}
            value={filters.price || [0, 10000000]} // Nếu price là null, hiển thị tất cả
            className="w-full"
            tooltip={{
              formatter: (value) => {
                if (filters.price === null) {
                  return 'Không giới hạn' // Hiển thị khi price là null
                }
                return `${formatNumberToCurrency(value)} VND`
              },
            }}
          />
        </div>
      </div>

      {/* Card View Toggle */}
      {setIsCardView && (
        <div className="flex items-center mt-4 sm:mt-0">
          <Switch
            checked={isCardView}
            onChange={() => setIsCardView(!isCardView)}
            className="mr-3"
          />
          <span className="text-sm">Xem dưới dạng Card</span>
        </div>
      )}
    </div>
  )
}

export default ProductFilter
