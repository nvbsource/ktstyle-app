import { api } from './api'

// Lấy tất cả kho hàng
export const fetchInventories = async (filters, itemType) => {
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
      if (itemType === 'accessory') {
        queryParams.append('type', 'accessory')
      } else {
        queryParams.append('type', 'product')
      }
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

export const fetchInventoryHistory = async (inventoryId) => {
  try {
    const response = await api.get(`/inventories/${inventoryId}/history`)
    return response.data
  } catch (error) {
    console.error('lỗi khi lấy lịch sử kho hàng:', error)
    throw error
  }
}

export const submitInventory = async (inventoryId, data) => {
  try {
    const response = await api.put(`/inventories/${inventoryId}/update`, data)
    return response.data
  } catch (error) {
    console.error('Lỗi khi cập nhật kho hàng:', error)
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
