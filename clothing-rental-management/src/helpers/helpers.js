import { format } from 'date-fns'
export function formatNumberToCurrency(number) {
  return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

export function truncateString(str, maxLength) {
  if (str.length > maxLength) {
    return str.slice(0, maxLength) + '...'
  }
  return str
}

export function flattenObjectArray(arr, childrenKey = 'children') {
  const result = []

  const flatten = (items) => {
    items.forEach((item) => {
      // Thêm object hiện tại vào mảng kết quả
      const { [childrenKey]: children, ...rest } = item // Tách children ra khỏi object
      result.push(rest) // Thêm object hiện tại (không bao gồm children)

      // Nếu có children, tiếp tục flatten
      if (children && Array.isArray(children)) {
        flatten(children)
      }
    })
  }

  flatten(arr) // Bắt đầu flatten từ cấp đầu tiên
  return result
}

export function formatDate(isoString, formatStr = 'dd/MM/yyyy HH:mm:ss') {
  return format(new Date(isoString), formatStr)
}
