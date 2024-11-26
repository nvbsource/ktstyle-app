import React, { useState, useEffect } from 'react';
import { Input, Slider, Select, Button, Switch, DatePicker, message } from 'antd';
import { fetchContents } from '../services/api'; // Giả sử fetchProducts là API gọi sản phẩm
import { formatNumberToCurrency } from '../helpers/helpers';
import { fetchCategories } from '../services/categoryApi';
const { RangePicker } = DatePicker;


const ContentFilter = ({ setLoading, setContents, setIsCardView, isCardView }) => {
    const [filters, setFilters] = useState({
        name: '',
        category: null,
        date: [],
    });

    const [debouncedFilters, setDebouncedFilters] = useState(filters);
    const [topics, settopics] = useState([]);

    const [debounceTimeout, setDebounceTimeout] = useState(null);

    useEffect(() => {
        // Hủy bỏ timeout cũ nếu có
        if (debounceTimeout) {
          clearTimeout(debounceTimeout);
        }
    
        // Tạo timeout mới
        const timeout = setTimeout(() => {
          setDebouncedFilters(filters);
        }, 300); // Delay 300ms sau khi user ngừng thay đổi filter
    
        // Lưu timeout id để có thể hủy bỏ sau
        setDebounceTimeout(timeout);
      }, [filters]);

    // Effect to call loadProducts when filters change
    useEffect(() => {
        loadProducts();
    }, [debouncedFilters]); // Khi filter thay đổi sẽ gọi lại API

    useEffect(() => {
        const loadtopics = async () => {
            try {
                const response = await fetchCategories();
                settopics(response.data);
            } catch (error) {
                message.error('Lỗi khi tải danh mục');
            }
        };
        loadtopics();
    }, []);

    // Hàm xử lý thay đổi của tên
    const handleNameFilterChange = (e) => {
        const value = e.target.value;
        setFilters((prevFilters) => ({
            ...prevFilters,
            name: value,
        }));
    };

    // Hàm xử lý thay đổi của category
    const handleCategoryFilterChange = (value) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            category: value,
        }));
    };

    // Hàm xử lý thay đổi của date
    const handleDateFilterChange = (dates) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            date: dates,
        }));
    };

    // Hàm gọi API để lấy dữ liệu với các bộ lọc
    const loadProducts = async () => {
        setLoading(true);
        try {
            const response = await fetchContents(filters);  // Pass filters as a parameter to the API
            setContents(response.data);
        } catch (error) {
            console.log(error);
            message.error("Lỗi khi tải sản phẩm");
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-wrap justify-between mb-4 gap-4">
            <div className="flex gap-4 flex-wrap w-full sm:w-auto">

                {/* Name Filter */}
                <div className="flex flex-col w-full sm:w-48">
                    <label className="mb-2 text-sm font-medium text-gray-700">Tìm tên sản phẩm</label>
                    <Input
                        placeholder="Tìm tên sản phẩm"
                        value={filters.name}
                        onChange={handleNameFilterChange}
                        className="w-full"
                    />
                </div>

                {/* Category Filter */}
                <div className="flex flex-col w-full sm:w-48">
                    <label className="mb-2 text-sm font-medium text-gray-700">Chọn chủ đề</label>
                    <Select
                        placeholder="Chọn chủ đề"
                        value={filters.category}
                        onChange={handleCategoryFilterChange}
                        className="w-full"
                        options={[
                            { value: null, label: "Tất cả chủ đề" }, // Option for "All topics"
                            ...topics.map((category) => ({
                                value: category.id,
                                label: category.name,
                            })),
                        ]}
                    />
                </div>

                {/* Date Filter */}
                <div className="flex flex-col w-full sm:w-72">
                    <label className="mb-2 text-sm font-medium text-gray-700">Lọc theo ngày tải lên</label>
                    <RangePicker
                        onChange={handleDateFilterChange}
                        className="w-full"
                    />
                </div>
            </div>

            {/* Card View Toggle */}
            {setIsCardView && <div className="flex items-center mt-4 sm:mt-0">
                <Switch
                    checked={isCardView}
                    onChange={() => setIsCardView(!isCardView)}
                    className="mr-3"
                />
                <span className="text-sm">Xem dưới dạng Card</span>
            </div>}
            
        </div>
    );
};

export default ContentFilter;
