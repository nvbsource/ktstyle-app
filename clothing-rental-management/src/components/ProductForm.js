import { Form, Input, Button, Upload, message, Modal, Select, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { fetchCategories } from '../services/api';

const ProductForm = ({ onSubmit, initialData }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);
    const [imageUrlsMap, setImageUrlsMap] = useState({});
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await fetchCategories();
                const data = response.data;
                setCategories(data);
            } catch (error) {
                message.error("Lỗi khi tải danh sách danh mục");
            }
        };
        loadCategories();
    }, []);

    useEffect(() => {
        if (initialData) {
            console.log(initialData.categories);

            form.setFieldsValue({
                name: initialData.name,
                description: initialData.description,
                note: initialData.note,
                import_price: initialData.import_price,
                rental_price: initialData.rental_price,
                // Lấy mảng các `id` từ danh sách danh mục trong `initialData`
                categories: initialData.categories.map((category) => category.id),
            });
            setFileList(
                initialData.images.map((url, index) => ({
                    uid: `-${index}`,
                    name: `image${index + 1}.png`,
                    status: 'done',
                    url,
                }))
            );
            setImageUrls(initialData.images);
            setImageUrlsMap(
                initialData.images.reduce((map, url, index) => {
                    map[`-${index}`] = url;
                    return map;
                }, {})
            );
        } else {
            form.resetFields();
            setFileList([]);
            setImageUrls([]);
            setImageUrlsMap({});
        }
    }, [initialData, form]);

    const handleUpload = async ({ file, onSuccess, onError }) => {
        const formData = new FormData();
        formData.append('file', file.originFileObj || file);

        try {
            const response = await fetch('http://localhost:5005/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            const url = data.url;

            setImageUrls((prev) => [...prev, url]);
            setImageUrlsMap((prevMap) => ({ ...prevMap, [file.uid]: url }));
            setFileList((prevList) =>
                prevList.map((f) => (f.uid === file.uid ? { ...f, status: 'done', url } : f))
            );

            onSuccess("ok");
            message.success('Tải ảnh lên thành công!');
        } catch (error) {
            onError(error);
            message.error('Lỗi khi tải ảnh lên');
        }
    };

    const handleFinish = async (values) => {
        const productData = { ...values, images: imageUrls };

        try {
            // Gửi dữ liệu đến backend để thêm hoặc cập nhật sản phẩm
            await onSubmit(productData);

            // Nếu không có lỗi từ backend, reset form
            form.resetFields();
            setImageUrls([]);
            setImageUrlsMap({});
            setFileList([]);
        } catch (error) {
            // Nếu có lỗi, gắn lỗi vào form
            if (error.response && error.response.data && error.response.data.errors) {
                const errors = error.response.data.errors;

                // Định dạng lỗi thành dạng mà Ant Design Form yêu cầu
                const formattedErrors = Object.keys(errors).map((key) => ({
                    name: key,
                    errors: [errors[key]],  // Gắn thông báo lỗi vào từng trường
                }));

                // Gắn lỗi vào form
                form.setFields(formattedErrors);
            } else {
                message.error('Đã có lỗi xảy ra!');
            }
        }
    };

    const handlePreview = (file) => {
        setPreviewImage(file.url || file.thumbUrl);
        setPreviewVisible(true);
    };

    const handleChange = ({ fileList }) => setFileList(fileList);

    const handleRemove = (file) => {
        const urlToRemove = imageUrlsMap[file.uid];
        if (urlToRemove) {
            setImageUrls((prevUrls) => prevUrls.filter((url) => url !== urlToRemove));
            setImageUrlsMap((prevMap) => {
                const newMap = { ...prevMap };
                delete newMap[file.uid];
                return newMap;
            });
        }
    };

    const tagRender = (props) => {
        const { label, value, closable, onClose } = props;

        const colors = ["magenta", "red", "volcano", "orange", "gold", "lime", "green", "cyan", "blue", "geekblue", "purple"];
        const randomColor = colors[value % colors.length];
        return (
            <Tag color={randomColor} closable={closable} onClose={onClose} style={{ marginRight: 3 }}>
                {label}
            </Tag>
        );
    };

    return (
        <Form form={form} onFinish={handleFinish} layout="vertical">
            <Form.Item
                label="Tên sản phẩm"
                name="name"
                rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
            >
                <Input placeholder="Nhập tên sản phẩm" />
            </Form.Item>

            <Form.Item
                label="Mô tả"
                name="description"
                rules={[{ required: true, message: 'Vui lòng nhập mô tả sản phẩm' }]}
            >
                <Input.TextArea rows={4} placeholder="Nhập mô tả sản phẩm" />
            </Form.Item>

            <Form.Item
                label="Ghi chú"
                name="note"
            >
                <Input.TextArea rows={4} placeholder="Nhập ghi chú sản phẩm" />
            </Form.Item>

            <Form.Item
                label="Giá nhập"
                name="import_price"
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập giá sản phẩm'
                    }
                ]}
            >
                <Input
                    placeholder="Nhập giá cho thuê sản phẩm"
                    type="number"
                    min={0}
                />
            </Form.Item>

            <Form.Item
                label="Giá cho thuê"
                name="rental_price"
                rules={[
                    {
                        validator: (_, value) => {
                            if (!value) {
                                return Promise.reject(new Error('Vui lòng nhập giá cho thuê'));
                            }
                            if (value < 10000) {
                                return Promise.reject(new Error('Giá cho thuê phải từ 10,000 VND trở lên'));
                            }
                            if (value % 1000) {
                                return Promise.reject(new Error('Giá cho thuê phải chia hết cho 1.000'));
                            }
                            return Promise.resolve();
                        }
                    }
                ]}
            >
                <Input
                    placeholder="Nhập giá cho thuê sản phẩm"
                    type="number"
                />
            </Form.Item>

            <Form.Item
                label="Danh mục"
                name="categories"
            >
                <Select
                    mode="multiple"
                    placeholder="Chọn danh mục"
                    options={categories.map((category) => ({
                        label: category.name,
                        value: category.id,
                    }))}
                    tagRender={tagRender}
                />
            </Form.Item>

            <Form.Item
                label="Hình ảnh sản phẩm"
                name="images"
                rules={[
                    {
                        validator: (_, value) => imageUrls.length > 0
                            ? Promise.resolve()
                            : Promise.reject('Vui lòng tải ít nhất một ảnh')
                    }
                ]}
            >
                <Upload
                    listType="picture-card"
                    customRequest={handleUpload}
                    fileList={fileList}
                    onChange={handleChange}
                    onRemove={handleRemove}
                    multiple
                    onPreview={handlePreview}
                >
                    <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                    </div>
                </Upload>
            </Form.Item>

            <Modal
                visible={previewVisible}
                footer={null}
                onCancel={() => setPreviewVisible(false)}
            >
                <div style={{ padding: "20px" }}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </div>
            </Modal>

            <Button type="primary" htmlType="submit">
                {initialData ? "Cập nhật" : "Thêm"}
            </Button>
        </Form>

    );
};

export default ProductForm;
