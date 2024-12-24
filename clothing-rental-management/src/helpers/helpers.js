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

export function textToSlug(text) {
  return text
    .toString() // Chuyển giá trị về chuỗi (phòng trường hợp input không phải chuỗi)
    .normalize('NFD') // Chuẩn hóa chuỗi Unicode
    .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu tiếng Việt
    .toLowerCase() // Chuyển thành chữ thường
    .trim() // Loại bỏ khoảng trắng đầu và cuối
    .replace(/[^a-z0-9\s-]/g, '') // Loại bỏ ký tự không hợp lệ (chỉ giữ chữ, số, khoảng trắng, và dấu '-')
    .replace(/\s+/g, '-') // Thay khoảng trắng bằng dấu '-'
    .replace(/-+/g, '-'); // Loại bỏ dấu '-' thừa
}