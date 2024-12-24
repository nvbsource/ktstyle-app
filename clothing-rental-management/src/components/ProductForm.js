import {
  Form,
  Input,
  Button,
  Upload,
  message,
  Modal,
  Select,
  Tag,
  TreeSelect,
  Tabs,
  Table,
  Popconfirm,
} from 'antd'
import { FileOutlined, FolderOutlined, PlusOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import { fetchCategories } from '../services/categoryApi'
import { fetchLibraries } from '../services/libraryApi'
import { deleteVariant, fetchVariants } from '../services/api'
import { textToSlug } from '../helpers/helpers'

const { TabPane } = Tabs

const ProductForm = ({ onSubmit, onSubmitVariant, initialData, itemType }) => {
  const [form] = Form.useForm()
  const [formVariant] = Form.useForm()
  const [fileList, setFileList] = useState([])
  const [imageUrls, setImageUrls] = useState([])
  const [imageUrlsMap, setImageUrlsMap] = useState({})
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [categories, setCategories] = useState([])
  const [libraries, setLibraries] = useState([])
  const [treeData, setTreeData] = useState([])
  const [variants, setVariants] = useState([]) // State lưu biến thể
  const [editingVariant, setEditingVariant] = useState(null) // Biến thể đang được chỉnh sửa
  const [showFormVariant, setShowFormVariant] = useState(false) // Biến thể đang được chỉnh sửa
  const [tabActive, setTabActive] = useState('1')
  const [loadingVariant, setLoadingVariant] = useState(false)
  const treeSelectData = convertTreeDataForTreeSelect(treeData)

  const initValuesVariant = {
    quantity: 0,
  }

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetchCategories()
        const data = response.data
        setCategories(data)
        setTreeData(transformCategoriesToTreeData(data))
      } catch (error) {
        message.error('Lỗi khi tải danh sách danh mục')
      }
    }
    const loadLibraries = async () => {
      try {
        const response = await fetchLibraries()
        const data = response.data
        setLibraries(data)
      } catch (error) {
        message.error('Lỗi khi tải danh sách thư viện')
      }
    }
    loadCategories()
    if (itemType === 'product') {
      loadLibraries()
    }
  }, [])

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        name: initialData.name,
        description: initialData.description,
        slug: initialData.slug || textToSlug(initialData.name),
        notes: initialData.notes,
        import_price: initialData.import_price,
        rental_price: initialData.rental_price,
        category_id: initialData.category ? initialData.category.id : null,
        libraries:
          itemType === 'product'
            ? initialData.libraries.map((library) => library.id)
            : null,
      })
      setFileList(
        initialData.images.map((url, index) => ({
          uid: `-${index}`,
          name: `image${index + 1}.png`,
          status: 'done',
          url,
        }))
      )
      setImageUrls(initialData.images)
      setImageUrlsMap(
        initialData.images.reduce((map, url, index) => {
          map[`-${index}`] = url
          return map
        }, {})
      )
    } else {
      form.resetFields()
      setFileList([])
      setImageUrls([])
      setImageUrlsMap({})
      setVariants([])
    }
  }, [initialData, form])

  useEffect(() => {
    if (tabActive === '2') {
      loadVariants()
    }
  }, [tabActive])

  const handleValuesChange = (changedValues, allValues) => {
    if (changedValues.name) {
      const slug = textToSlug(changedValues.name)
      form.setFieldsValue({ slug }) // Cập nhật giá trị field "slug"
    }
  }

  const loadVariants = async () => {
    setLoadingVariant(true)
    if (initialData && initialData?.id) {
      try {
        const response = await fetchVariants(initialData.id) // Pass filters as a parameter to the API
        setVariants(response.data)
      } catch (error) {
        message.error('Lỗi khi tải biến thể')
      }
    }
    setLoadingVariant(false)
  }
  const transformCategoriesToTreeData = (categories) => {
    return categories.map((category) => ({
      title: category.name,
      key: category.id,
      icon:
        category.children && category.children.length > 0 ? (
          <FolderOutlined />
        ) : (
          <FileOutlined />
        ),
      children:
        category.children && category.children.length > 0
          ? transformCategoriesToTreeData(category.children)
          : [],
    }))
  }

  const handleUpload = async ({ file, onSuccess, onError }) => {
    const formData = new FormData()
    formData.append('file', file.originFileObj || file)

    try {
      const response = await fetch('http://localhost:5005/api/admin/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      const url = data.url
      const urls = (prev) => [...prev, url]

      setImageUrls(urls)
      setImageUrlsMap((prevMap) => ({ ...prevMap, [file.uid]: url }))
      setFileList((prevList) =>
        prevList.map((f) =>
          f.uid === file.uid ? { ...f, status: 'done', url } : f
        )
      )

      onSuccess('ok')
      message.success('Tải ảnh lên thành công!')
    } catch (error) {
      onError(error)
      message.error('Lỗi khi tải ảnh lên')
    }
  }

  const handleFinish = async (values) => {
    const productData = { ...values, images: imageUrls }
    try {
      await onSubmit(productData)
      form.resetFields()
      setImageUrls([])
      setImageUrlsMap({})
      setFileList([])
      setVariants([])
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const errors = error.response.data.errors
        const formattedErrors = Object.keys(errors).map((key) => ({
          name: key,
          errors: [errors[key]],
        }))
        form.setFields(formattedErrors)
      } else {
        message.error(error.response.data.message)
      }
    }
  }
  const handleFinishVariant = async (values) => {
    try {
      await onSubmitVariant(values, editingVariant?.id)
      loadVariants()
      formVariant.resetFields()
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const errors = error.response.data.errors
        const formattedErrors = Object.keys(errors).map((key) => ({
          name: key,
          errors: [errors[key]],
        }))
        formVariant.setFields(formattedErrors)
      } else {
        message.error(error.response.data.message)
      }
    }
  }

  const handlePreview = (file) => {
    setPreviewImage(file.url || file.thumbUrl)
    setPreviewVisible(true)
  }

  const handleChange = ({ fileList }) => setFileList(fileList)

  const handleRemove = (file) => {
    const urlToRemove = imageUrlsMap[file.uid]
    if (urlToRemove) {
      setImageUrls((prevUrls) => prevUrls.filter((url) => url !== urlToRemove))
      setImageUrlsMap((prevMap) => {
        const newMap = { ...prevMap }
        delete newMap[file.uid]
        return newMap
      })
    }
  }

  const handleEditVariant = (index) => {
    setEditingVariant({ ...variants[index], index })
    formVariant.setFieldsValue({
      size: variants[index].size,
      color: variants[index].color,
      quantity: variants[index].quantity,
    })
    setShowFormVariant(true)
  }

  const handleDeleteVariant = async (variant) => {
    try {
      const response = await deleteVariant(variant.id)
      message.success(response.message)
      loadVariants()
    } catch (error) {
      message.error(error.response?.data?.message)
    }
  }

  const tagRender = (props) => {
    const { label, value, closable, onClose } = props

    const colors = [
      'magenta',
      'red',
      'volcano',
      'orange',
      'gold',
      'lime',
      'green',
      'cyan',
      'blue',
      'geekblue',
      'purple',
    ]
    const randomColor = colors[value % colors.length]
    return (
      <Tag
        color={randomColor}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        {label}
      </Tag>
    )
  }

  const handleCloseEditVariant = () => {
    setEditingVariant(null)
    setShowFormVariant(false)
  }

  const handleShowFormCreateVariant = () => {
    setEditingVariant(null)
    setShowFormVariant(true)
    formVariant.resetFields()
  }

  return (
    <Tabs onChange={(key) => setTabActive(key)} activeKey={tabActive}>
      {/* Tab 1: Thông tin Sản phẩm */}
      <TabPane tab="Thông tin sản phẩm" key="1">
        <Form
          form={form}
          onFinish={handleFinish}
          layout="vertical"
          className="space-y-6 bg-white p-6 rounded-lg shadow-md"
          onValuesChange={handleValuesChange}
        >
          {/* Tên sản phẩm */}
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
            className="col-span-1"
          >
            <Input placeholder="Nhập tên sản phẩm" className="rounded-md" />
          </Form.Item>
          <Form.Item
            label="Url sản phẩm"
            name="slug"
            rules={[{ required: true, message: 'Vui lòng nhập url sản phẩm' }]}
            className="col-span-1"
          >
            <Input placeholder="Nhập tên sản phẩm" className="rounded-md" />
          </Form.Item>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item label="Mô tả" name="description" className="col-span-1">
              <Input.TextArea
                rows={4}
                placeholder="Nhập mô tả sản phẩm"
                className="rounded-md"
              />
            </Form.Item>
            {/* Ghi chú */}
            <Form.Item label="Ghi chú" name="notes">
              <Input.TextArea
                rows={4}
                placeholder="Nhập ghi chú sản phẩm"
                className="rounded-md"
              />
            </Form.Item>
          </div>

          {/* Giá nhập và Giá cho thuê */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              label="Giá nhập"
              name="import_price"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập giá sản phẩm',
                },
              ]}
              className="col-span-1"
            >
              <Input
                placeholder="Nhập giá sản phẩm"
                type="number"
                min={0}
                className="rounded-md"
              />
            </Form.Item>

            <Form.Item
              label="Giá cho thuê"
              name="rental_price"
              rules={[
                {
                  validator: (_, value) => {
                    if (!value) {
                      return Promise.resolve()
                    }
                    if (value < 10000) {
                      return Promise.reject(
                        new Error('Giá cho thuê phải từ 10.000 VND trở lên')
                      )
                    }
                    if (value % 1000) {
                      return Promise.reject(
                        new Error('Giá cho thuê phải chia hết cho 1.000')
                      )
                    }
                    return Promise.resolve()
                  },
                },
              ]}
              className="col-span-1"
            >
              <Input
                placeholder="Nhập giá cho thuê sản phẩm"
                type="number"
                className="rounded-md"
              />
            </Form.Item>
          </div>

          <div
            className={`grid grid-cols-1 ${itemType === 'product' ? 'md:grid-cols-2' : ''} gap-6`}
          >
            <Form.Item
              label="Danh mục"
              name="category_id"
              className="col-span-1"
            >
              <TreeSelect
                treeData={treeSelectData}
                placeholder="Chọn danh mục"
                allowClear
                treeDefaultExpandAll
                className="rounded-md"
              />
            </Form.Item>
            {itemType === 'product' && (
              <Form.Item
                label="Thư viện"
                name="libraries"
                className="col-span-1"
              >
                <Select
                  mode="multiple"
                  placeholder="Chọn danh mục"
                  options={libraries.map((library) => ({
                    label: library.name,
                    value: library.id,
                  }))}
                  tagRender={tagRender}
                  className="rounded-md"
                />
              </Form.Item>
            )}
          </div>

          {/* Hình ảnh sản phẩm */}
          <Form.Item
            label="Hình ảnh sản phẩm"
            name="images"
            rules={[
              {
                validator: (_, value) => {
                  return value && value.fileList && value.fileList.length > 0
                    ? Promise.resolve()
                    : Promise.reject('Vui lòng tải ít nhất một ảnh')
                },
              },
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

          {/* Nút hành động */}
          <div className="flex justify-end">
            <Button type="primary" htmlType="submit" className="rounded-md">
              {initialData ? 'Cập nhật' : 'Thêm'}
            </Button>
          </div>
        </Form>
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={() => setPreviewVisible(false)}
        >
          <div style={{ padding: '20px' }}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </div>
        </Modal>
      </TabPane>
      {itemType === 'product' && (
        <TabPane tab="Biến thể" key="2" disabled={!initialData}>
          <Table
            dataSource={variants}
            loading={loadingVariant}
            columns={[
              {
                title: 'Id',
                dataIndex: 'id',
                key: 'id',
              },
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
              // {
              //   title: 'Số lượng tồn trong kho',
              //   dataIndex: 'quantity',
              //   key: 'quantity',
              // },
              {
                title: 'Hành động',
                render: (variant, __, index) => (
                  <>
                    <Button
                      type="primary"
                      className="mr-3"
                      onClick={() => handleEditVariant(index)}
                    >
                      Sửa
                    </Button>
                    {variant.quantity <= 0 && (
                      <Button
                        type="primary"
                        onClick={() => handleDeleteVariant(index)}
                        danger
                      >
                        Xóa
                      </Button>
                    )}
                  </>
                ),
              },
            ]}
            rowKey={(record, index) => index}
          />

          {showFormVariant && (
            <div style={{ marginTop: 16 }}>
              <Form
                form={formVariant}
                initialValues={initValuesVariant}
                onFinish={handleFinishVariant}
                layout="vertical"
              >
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
                {editingVariant && (
                  <Button
                    type="dashed"
                    htmlType="submit"
                    className="mr-3"
                    onClick={handleCloseEditVariant}
                  >
                    Đóng
                  </Button>
                )}
                <Button type="primary" htmlType="submit">
                  {editingVariant ? 'Cập nhật' : 'Thêm mới'}
                </Button>
              </Form>
            </div>
          )}
          {(!showFormVariant || editingVariant) && (
            <Button
              type="dashed"
              onClick={handleShowFormCreateVariant}
              style={{ marginTop: 16 }}
            >
              <PlusOutlined /> Thêm biến thể
            </Button>
          )}
        </TabPane>
      )}
    </Tabs>
  )
}

const convertTreeDataForTreeSelect = (treeData) => {
  return treeData.map((item) => ({
    label: item.title,
    value: item.key,
    children: item.children ? convertTreeDataForTreeSelect(item.children) : [],
  }))
}

export default ProductForm
