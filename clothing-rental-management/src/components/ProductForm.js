import { Form, Input, Button, Upload, message, Modal, Select, Tag, TreeSelect, Tabs, Table, Popconfirm } from 'antd';
import { FileOutlined, FolderOutlined, PlusOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { fetchCategories } from '../services/categoryApi';
import { fetchLibraries } from '../services/libraryApi';
import { fetchVariants } from '../services/api';

const { TabPane } = Tabs;

const ProductForm = ({ onSubmit, onSubmitVariant, initialData }) => {
    const [form] = Form.useForm();
    const [formVariant] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);
    const [imageUrlsMap, setImageUrlsMap] = useState({});
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [categories, setCategories] = useState([]);
    const [libraries, setLibraries] = useState([]);
    const [treeData, setTreeData] = useState([]);
    const [variants, setVariants] = useState([]); // State lưu biến thể
    const [editingVariant, setEditingVariant] = useState(null); // Biến thể đang được chỉnh sửa
    const [showFormVariant, setShowFormVariant] = useState(false); // Biến thể đang được chỉnh sửa

    const treeSelectData = convertTreeDataForTreeSelect(treeData);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await fetchCategories();
                const data = response.data;
                setCategories(data);
                setTreeData(transformCategoriesToTreeData(data));
            } catch (error) {
                message.error("Lỗi khi tải danh sách danh mục");
            }
        };
        const loadLibraries = async () => {
            try {
                const response = await fetchLibraries();
                const data = response.data;
                setLibraries(data);
            } catch (error) {
                message.error("Lỗi khi tải danh sách thư viện");
            }
        };
        loadCategories();
        loadLibraries();
    }, []);

    useEffect(() => {
        if (initialData) {
            form.setFieldsValue({
                name: initialData.name,
                description: initialData.description,
                notes: initialData.notes,
                import_price: initialData.import_price,
                rental_price: initialData.rental_price,
                category_id: initialData.category ? initialData.category.id : null,
                libraries: initialData.libraries.map((library) => library.id),
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
            loadVariants();
        } else {
            form.resetFields();
            setFileList([]);
            setImageUrls([]);
            setImageUrlsMap({});
            setVariants([]);
        }
    }, [initialData, form]);

    const loadVariants = async () => {
        if (initialData && initialData?.id) {
            try {
                const response = await fetchVariants(initialData.id);  // Pass filters as a parameter to the API
                setVariants(response.data);
            } catch (error) {
                message.error("Lỗi khi tải biến thể");
            }
        }
    };
    const transformCategoriesToTreeData = (categories) => {
        return categories.map((category) => ({
            title: category.name,
            key: category.id,
            icon: category.children && category.children.length > 0 ? (
                <FolderOutlined />
            ) : (
                <FileOutlined />
            ),
            children: category.children && category.children.length > 0
                ? transformCategoriesToTreeData(category.children)
                : [],
        }));
    };

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
            await onSubmit(productData);

            form.resetFields();
            setImageUrls([]);
            setImageUrlsMap({});
            setFileList([]);
            setVariants([]);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                const errors = error.response.data.errors;
                const formattedErrors = Object.keys(errors).map((key) => ({
                    name: key,
                    errors: [errors[key]],
                }));
                form.setFields(formattedErrors);
            } else {
                message.error(error.response.data.message);
            }
        }
    };
    const handleFinishVariant = async (values) => {
        try {
            await onSubmitVariant(values, editingVariant?.id);
            loadVariants();
            formVariant.resetFields();
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                const errors = error.response.data.errors;
                const formattedErrors = Object.keys(errors).map((key) => ({
                    name: key,
                    errors: [errors[key]],
                }));
                formVariant.setFields(formattedErrors);
            } else {
                message.error(error.response.data.message);
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

    const handleEditVariant = (index) => {
        setEditingVariant({ ...variants[index], index });
        formVariant.setFieldsValue({
            size: variants[index].size,
            color: variants[index].color,
            quantity: variants[index].quantity,
        });
        setShowFormVariant(true);
    };

    const handleDeleteVariant = (index) => {
        const updatedVariants = variants.filter((_, i) => i !== index);
        setVariants(updatedVariants);
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

    const handleCloseEditVariant = () => {
        setEditingVariant(null);
        setShowFormVariant(false);
    }

    const handleShowFormCreateVariant = () => {
        setEditingVariant(null);
        setShowFormVariant(true);
        formVariant.resetFields();
    }

    return (
        <Tabs defaultActiveKey="1">
            {/* Tab 1: Thông tin Sản phẩm */}
            <TabPane tab="Thông tin sản phẩm" key="1">
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
                        name="notes"
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

                    <Form.Item label="Danh mục" name="category_id">
                        <TreeSelect
                            treeData={treeSelectData} // Dữ liệu chuẩn hóa cho TreeSelect
                            placeholder="Chọn danh mục"
                            allowClear
                            treeDefaultExpandAll
                        />
                    </Form.Item>
                    <Form.Item
                        label="Thư viện"
                        name="libraries"
                    >
                        <Select
                            mode="multiple"
                            placeholder="Chọn danh mục"
                            options={libraries.map((library) => ({
                                label: library.name,
                                value: library.id,
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
                    <Button type="primary" htmlType="submit" style={{ marginTop: 16 }}>
                        {initialData ? 'Cập nhật' : 'Thêm'}
                    </Button>

                </Form>
                <Modal
                    visible={previewVisible}
                    footer={null}
                    onCancel={() => setPreviewVisible(false)}
                >
                    <div style={{ padding: "20px" }}>
                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                    </div>
                </Modal>
            </TabPane>

            {/* Tab 2: Quản lý Biến thể */}
            <TabPane tab="Biến thể" key="2" disabled={!initialData}>
                <Table
                    dataSource={variants}
                    columns={[
                        {
                            title: 'Size',
                            dataIndex: 'size',
                            key: 'size',
                        },
                        {
                            title: 'Màu',
                            dataIndex: 'color',
                            key: 'color',
                        },
                        {
                            title: 'Số lượng',
                            dataIndex: 'quantity',
                            key: 'quantity',
                        },
                        {
                            title: 'Hành động',
                            render: (_, __, index) => (
                                <>
                                    <Button type="link" onClick={() => handleEditVariant(index)}>
                                        Sửa
                                    </Button>
                                    <Popconfirm
                                        title="Bạn có chắc chắn muốn xóa?"
                                        onConfirm={() => handleDeleteVariant(index)}
                                    >
                                        <Button type="link" danger>
                                            Xóa
                                        </Button>
                                    </Popconfirm>
                                </>
                            ),
                        },
                    ]}
                    rowKey={(record, index) => index}
                />

                {showFormVariant && (
                    <div style={{ marginTop: 16 }}>
                        <Form form={formVariant} onFinish={handleFinishVariant} layout="vertical">

                            <Form.Item
                                label="Size"
                                name="size"
                                rules={[{ required: true, message: 'Vui lòng nhập size' }]}
                            >
                                <Input placeholder="Nhập size" />
                            </Form.Item>

                            <Form.Item
                                label="Màu sắc"
                                name="color"
                                rules={[{ required: true, message: 'Vui lòng nhập màu sắc' }]}
                            >
                                <Input placeholder="Nhập màu sắc" />
                            </Form.Item>

                            <Form.Item
                                label="Số lượng"
                                name="quantity"
                                rules={[{
                                    validator: (_, value) => {
                                        // Kiểm tra nếu không nhập gì (đã có rule required xử lý)
                                        if (value === undefined || value === null) {
                                            return Promise.resolve();
                                        }
                                        if (value > 100) {
                                            return Promise.reject(new Error('Số lượng chỉ nhập từ 1-100'));
                                        } else if (value < 0) {
                                            return Promise.reject(new Error('Số lượng phải là số và lớn hơn hoặc bằng 0'));
                                        } else {
                                            return Promise.resolve();
                                        }
                                    },
                                },]}
                            >
                                <Input type="number" placeholder="Nhập số lượng" />
                            </Form.Item>
                            {editingVariant && <Button type="dashed" htmlType='submit' className='mr-3' onClick={handleCloseEditVariant}>
                                Đóng
                            </Button>}
                            <Button type="primary" htmlType='submit'>
                                {editingVariant ? "Cập nhật" : "Thêm mới"}
                            </Button>
                        </Form>
                    </div>
                )}
                {
                    (!showFormVariant || editingVariant) && <Button type="dashed" onClick={handleShowFormCreateVariant} style={{ marginTop: 16 }}>
                        <PlusOutlined /> Thêm biến thể
                    </Button>
                }
            </TabPane>
        </Tabs>


    );
};

const convertTreeDataForTreeSelect = (treeData) => {
    return treeData.map((item) => ({
        label: item.title,
        value: item.key,
        children: item.children
            ? convertTreeDataForTreeSelect(item.children)
            : [],
    }));
};

export default ProductForm;