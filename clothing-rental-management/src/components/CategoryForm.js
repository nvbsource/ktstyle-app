import React, { useEffect } from 'react'
import { Form, Input, Button, TreeSelect, Checkbox, Switch } from 'antd'

const CategoryForm = ({ onSubmit, initialData, treeData }) => {
  const [form] = Form.useForm()

  // Chuyển đổi dữ liệu treeData sang cấu trúc phù hợp cho TreeSelect
  const treeSelectData = convertTreeDataForTreeSelect(treeData)

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        name: initialData.title,
        parent_id: initialData.parent_id || null,
      })
    } else {
      form.resetFields()
    }
  }, [initialData, form])

  const handleFinish = (values) => {
    onSubmit(values)
    form.resetFields()
  }

  return (
    <Form form={form} onFinish={handleFinish} layout="vertical">
      {/* Trường nhập tên danh mục */}
      <Form.Item
        label="Tên danh mục"
        name="name"
        rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
      >
        <Input placeholder="Nhập tên danh mục" />
      </Form.Item>
      <Form.Item label="Danh mục cha" name="parent_id">
        <TreeSelect
          treeData={treeSelectData} // Dữ liệu chuẩn hóa cho TreeSelect
          placeholder="Chọn danh mục cha (nếu có)"
          allowClear
          treeDefaultExpandAll
        />
      </Form.Item>
      {/* Nút submit */}
      <Button type="primary" htmlType="submit">
        {initialData ? 'Cập nhật' : 'Thêm'}
      </Button>
    </Form>
  )
}

// Hàm chuyển đổi treeData sang cấu trúc phù hợp cho TreeSelect
const convertTreeDataForTreeSelect = (treeData) => {
  return treeData.map((item) => ({
    label: item.title, // Đổi từ `title` sang `label`
    value: item.key, // Đổi từ `key` sang `value`
    children: item.children
      ? convertTreeDataForTreeSelect(item.children) // Đệ quy cho children
      : [],
  }))
}

export default CategoryForm
