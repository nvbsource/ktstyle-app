import React, { useEffect } from 'react';
import { Form, Input, Button } from 'antd';

const LibraryForm = ({ onSubmit, initialData }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue(initialData);
    } else {
      form.resetFields();
    }
  }, [initialData, form]);

  const handleFinish = (values) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Form form={form} onFinish={handleFinish} layout="vertical">
      <Form.Item
        label="Tên thư viện"
        name="name"
        rules={[{ required: true, message: 'Vui lòng nhập tên thư viện' }]}
      >
        <Input />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        {initialData ? 'Cập nhật' : 'Thêm'}
      </Button>
    </Form>
  );
};

export default LibraryForm;
