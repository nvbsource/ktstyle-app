import { api } from './api'

// Lấy tất cả kho hàng
export const fetchInventories = async (filters) => {
  try {
    let queryParams
    if (filters) {
      const {
        inventory_id,
        product_id,
        product_name,
        size,
        color,
        date_update,
        status,
      } = filters

      queryParams = new URLSearchParams()

      // Add filters to the query string
      if (inventory_id) queryParams.append('inventory_id', inventory_id)
      if (product_id) queryParams.append('product_id', product_id)
      if (product_name) queryParams.append('product_name', product_name)
      if (size) queryParams.append('size', size)
      if (color) queryParams.append('color', color)
      if (status) queryParams.append('status', status)

      if (date_update && date_update.length === 2) {
        const [startDate, endDate] = date_update
        queryParams.append('startDate', startDate.format('YYYY-MM-DD'))
        queryParams.append('endDate', endDate.format('YYYY-MM-DD'))
      }
    }
    const response = await api.get(
      `/inventories${queryParams ? `?${queryParams.toString()}` : ''}`
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi lấy danh sách kho hàng:', error)
    throw error
  }
}

// Thêm kho hàng mới
export const addInventory = async (inventory) => {
  try {
    const response = await api.post('/inventorys', inventory)
    return response.data
  } catch (error) {
    console.error('Lỗi khi thêm kho hàng:', error)
    throw error
  }
}

export const updateStatusInventory = async (id, data) => {
  try {
    const response = await api.put(`/inventories/${id}/update-status`, data)
    return response.data
  } catch (error) {
    console.error('Lỗi khi cập nhật kho hàng:', error)
    throw error
  }
}

export const updateInventoryQuantity = async (id, quantityChange) => {
  try {
    const response = await api.post(`/api/inventory/${id}/update-quantity`, {
      change: quantityChange,
    })
    return response.data
  } catch (error) {
    throw new Error('Failed to update inventory quantity')
  }
}

export const deleteInventory = async (id) => {
  try {
    const response = await api.delete(`/inventorys/${id}`)
    return response.data
  } catch (error) {
    console.error('Lỗi khi xóa kho hàng:', error)
    throw error
  }
}
