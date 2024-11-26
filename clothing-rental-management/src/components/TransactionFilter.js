import { DatePicker, Input, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { fetchTransactions } from '../services/transactionApi'; // Giả sử fetchTransactions là API gọi giao dịch
const { RangePicker } = DatePicker;


const TransactionFilter = ({ setLoading, setTransactions}) => {
    const [filters, setFilters] = useState({
        name: ''
    });

    const [debouncedFilters, setDebouncedFilters] = useState(filters);
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

    // Effect to call loadTransactions when filters change
    useEffect(() => {
        loadTransactions();
    }, [debouncedFilters]); // Khi filter thay đổi sẽ gọi lại API

    // Hàm xử lý thay đổi của tên
    const handleNameFilterChange = (e) => {
        const value = e.target.value;
        setFilters((prevFilters) => ({
            ...prevFilters,
            name: value,
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
    const loadTransactions = async () => {
        setLoading(true);
        try {
            const response = await fetchTransactions(filters);  // Pass filters as a parameter to the API
            setTransactions(response.data);
        } catch (error) {
            message.error("Lỗi khi tải giao dịch");
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-wrap justify-between mb-4 gap-4">
            <div className="flex gap-4 flex-wrap w-full sm:w-auto">

                {/* Name Filter */}
                <div className="flex flex-col w-full sm:w-48">
                    <label className="mb-2 text-sm font-medium text-gray-700">Tìm tên giao dịch</label>
                    <Input
                        placeholder="Tìm tên giao dịch"
                        value={filters.name}
                        onChange={handleNameFilterChange}
                        className="w-full"
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
        </div>
    );
};

export default TransactionFilter;
