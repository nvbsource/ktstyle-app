import { api } from './api'

// Lấy tất cả khách hàng
export const fetchCustomers = async (filters) => {
  try {
    let queryParams
    if (filters) {
      const { name, phone, dob, date } = filters
      queryParams = new URLSearchParams()

      // Add filters to the query string
      if (name) queryParams.append('name', name)
      if (phone) queryParams.append('phone', phone)

      if (dob) {
        queryParams.append('dob', dob.format('YYYY-MM-DD'))
      }

      if (date && date.length === 2) {
        const [startDate, endDate] = date
        queryParams.append('startDate', startDate.format('YYYY-MM-DD'))
        queryParams.append('endDate', endDate.format('YYYY-MM-DD'))
      }
    }
    const response = await api.get(
      `/customers${queryParams ? `?${queryParams.toString()}` : ''}`
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi lấy danh sách khách hàng:', error)
    throw error
  }
}

// Thêm khách hàng mới
export const addCustomer = async (customer) => {
  try {
    const response = await api.post('/customers', customer)
    return response.data
  } catch (error) {
    console.error('Lỗi khi thêm khách hàng:', error)
    throw error
  }
}

// Cập nhật khách hàng
export const updateCustomer = async (id, customer) => {
  try {
    const response = await api.put(`/customers/${id}`, customer)
    return response.data
  } catch (error) {
    console.error('Lỗi khi cập nhật khách hàng:', error)
    throw error
  }
}

export const deleteCustomer = async (id) => {
  try {
    const response = await api.delete(`/customers/${id}`)
    return response.data
  } catch (error) {
    console.error('Lỗi khi xóa khách hàng:', error)
    throw error
  }
}
