import React, { useEffect, useRef, useState } from 'react';
import { Modal, Button, Input, Select, Upload, Checkbox, Row, Col, Form, message, Avatar } from 'antd';
import { CheckCircleOutlined, FrownOutlined, PlusOutlined, SearchOutlined, SmileOutlined, UserOutlined } from '@ant-design/icons';
import { Editor } from '@tinymce/tinymce-react';
import { addTopic, fetchProducts, fetchTopics } from '../services/api';
import ProductCard from './ProductCard';
import ProductFilter from './ProductFilter';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import TextArea from 'antd/es/input/TextArea';
import { Option } from 'antd/es/mentions';

const AddContentModal = ({ visible, onCancel, onCreate, initialData }) => {
  const [form] = Form.useForm();
  const [products, setProducts] = useState([]);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [imageUrlsMap, setImageUrlsMap] = useState({});
  const [visibleProducts, setVisibleProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); // Sản phẩm đang xem chi tiết
  const [selectedTempProduct, setSelectedTempProduct] = useState(null);
  const [fileList, setFileList] = useState([]); // State để quản lý danh sách file tải lên
  const [imageUrls, setImageUrls] = useState([]); // State để quản lý các URL của ảnh
  const [selectedImages, setSelectedImages] = useState([]);
  const textAreaRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState(null); // Lưu vị trí con trỏ
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [searchValue, setSearchValue] = useState(''); // State để lưu giá trị tìm kiếm
  const [topics, setTopics] = useState([]); // State để lưu danh sách các chủ đề
  const [isLoading, setIsLoading] = useState(false); // State để xử lý trạng thái tải dữ liệu
  const [formData, setFormData] = useState({
    content: '',
    topic: null,
    files: [],
    isEvergreen: false,
    publishNow: true,
  });

  const handleCancel = () => {
    form.resetFields()
    onCancel();
  }

  const handleFetchTopics = async (value) => {
    setSearchValue(value);
    setIsLoading(true);
    try {
      const response = await fetchTopics(value);
      setTopics(response.data);
    } catch (error) {
      console.error('Error fetching topics:', error);
      message.error('Không thể tìm thấy chủ đề');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTopic = async () => {
    if (!searchValue) {
      message.error('Vui lòng nhập tên chủ đề');
      return;
    }

    setIsLoading(true);

    try {
      const response = await addTopic({ name: searchValue });
      message.success('Chủ đề mới đã được thêm!');
      setTopics((prev) => [response.data, ...prev]);
      setFormData((prev) => ({ ...prev, topic: response.data.id }));
    } catch (error) {
      message.error('Có lỗi khi thêm chủ đề');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        content: initialData.content,
      });
      setFileList(
        initialData.image_urls.map((url, index) => ({
          uid: `-${index}`,
          name: `image${index + 1}.png`,
          status: 'done',
          url,
        }))
      );
      setImageUrls(initialData.image_urls);
      setImageUrlsMap(
        initialData.image_urls.reduce((map, url, index) => {
          map[`-${index}`] = url;
          return map;
        }, {})
      );
      setSelectedProduct(initialData.product)
      setSelectedTempProduct(initialData.product)
      setSelectedImages(initialData.image_urls.filter(img => initialData.product.images.includes(img)));
    } else {
      form.resetFields();
      setFileList([]);
      setImageUrls([]);
      setImageUrlsMap({});
      setSelectedProduct([])
      setSelectedImages([])
      setSelectedTempProduct([])
    }
  }, [initialData, form]);

  const handleCursorChange = (e) => {
    setCursorPosition(e.target.selectionStart); // Lưu vị trí con trỏ khi click hoặc gõ phím
  };

  const handlePreview = (file) => {
    setPreviewImage(file.url || file.thumbUrl);
    setPreviewVisible(true);
  };


  const addEmoji = (emoji) => {
    if (textAreaRef.current) {
      const textArea = textAreaRef.current.resizableTextArea.textArea; // Truy cập phần tử DOM thực tế
      const currentText = form.getFieldValue("content") || ""; // Lấy giá trị hiện tại của content từ form

      // Lấy vị trí selectionStart và selectionEnd
      const selectionStart = textArea.selectionStart;
      const selectionEnd = textArea.selectionEnd;

      let newText;
      let updatedPosition;

      if (selectionStart !== selectionEnd) {
        // Nếu có đoạn text được bôi đen
        newText =
          currentText.slice(0, selectionStart) +
          emoji.native +
          currentText.slice(selectionEnd);
        updatedPosition = selectionStart + emoji.native.length; // Vị trí con trỏ sau emoji
      } else {
        // Nếu không có đoạn text được bôi đen, chèn emoji tại vị trí con trỏ
        newText =
          currentText.slice(0, cursorPosition) +
          emoji.native +
          currentText.slice(cursorPosition);
        updatedPosition = cursorPosition + emoji.native.length; // Vị trí con trỏ sau emoji
      }

      form.setFieldsValue({ content: newText });

      // Đặt lại vị trí con trỏ sau khi thêm hoặc thay thế
      setTimeout(() => {
        textArea.focus(); // Focus lại vào TextArea
        textArea.setSelectionRange(updatedPosition, updatedPosition); // Đặt lại vị trí con trỏ
        setCursorPosition(updatedPosition); // Cập nhật lại vị trí con trỏ
      }, 0);
    }
  };

  const loadProducts = async () => {
    setLoadingProduct(true);
    try {
      const response = await fetchProducts();  // Pass filters as a parameter to the API
      setProducts(response.data);
    } catch (error) {
      message.error("Lỗi khi tải sản phẩm");
    }
    setLoadingProduct(false);
  };

  const handleProductModalOpen = () => {
    setVisibleProducts(!visibleProducts)
    setSelectedTempProduct(selectedProduct)
    loadProducts();
  }

  // Xử lý khi thay đổi các file tải lên
  const handleFileChange = ({ fileList }) => {
    setFileList(fileList)
  }

  // Xử lý tải ảnh lên
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

  // Xử lý khi người dùng xóa file
  const handleRemove = (file) => {
    setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
    setImageUrls((prev) => prev.filter((url) => url !== file.url));
    setSelectedImages((prev) => prev.filter((url) => url !== file.url));
  };

  const handleCancelSelectProduct = () => {
    setVisibleProducts(false);
    setSelectedTempProduct(null)
  }

  const handleSelectedProduct = () => {
    setVisibleProducts(false);
    setSelectedProduct(selectedTempProduct)
  }
  console.log(form.getFieldsValue());


  const handleFinish = async (values) => {
    const contentData = {
      ...values,
      image_urls: imageUrls,
      product_id: selectedProduct ? selectedProduct.id : undefined
    };

    try {
      // Gửi dữ liệu đến backend để thêm hoặc cập nhật sản phẩm
      await onCreate(contentData);

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
        message.error(error.response.data.message);
      }
    }
  };

  const handleAddImage = (url) => {
    // Kiểm tra xem ảnh đã có trong danh sách chưa
    const existingFile = fileList.find((file) => file.url === url);

    // Nếu ảnh chưa có trong fileList, thì thêm ảnh vào fileList và các state khác
    if (!existingFile) {
      const newFile = {
        uid: Date.now(),  // Tạo UID duy nhất cho ảnh
        name: 'image',  // Bạn có thể điều chỉnh tên này nếu cần
        status: 'done',  // Trạng thái của ảnh khi đã tải lên
        url: url,  // URL của ảnh
      };

      // Cập nhật lại fileList, imageUrls và imageUrlsMap
      setFileList((prev) => [...prev, newFile]);
      setImageUrls((prev) => [...prev, url]);
      setImageUrlsMap((prevMap) => ({
        ...prevMap,
        [newFile.uid]: url,
      }));
    }

    // Nếu ảnh đã chọn, bỏ chọn (xóa khỏi danh sách)
    if (selectedImages.includes(url)) {
      setSelectedImages(selectedImages.filter((imageUrl) => imageUrl !== url));

      // Gỡ ảnh khỏi fileList và imageUrls
      setFileList((prev) => prev.filter((file) => file.url !== url));
      setImageUrls((prev) => prev.filter((imageUrl) => imageUrl !== url));
      setImageUrlsMap((prevMap) => {
        const newMap = { ...prevMap };
        delete newMap[Object.keys(newMap).find(key => newMap[key] === url)];
        return newMap;
      });
    } else {
      // Nếu chưa chọn, thêm vào danh sách
      setSelectedImages((prev) => [...prev, url]);
    }
  };
  console.log(topics);


  return (
    <>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        maskClosable={false}
        footer={[
          <Button key="cancel" onClick={handleCancel} className="text-gray-500">
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            {initialData ? "Cập nhật bài viết" : "Viết bài mới"}
          </Button>,
        ]}
        width={1400}
      >
        <h3 className='text-[18px] font-bold mb-3'>  {initialData ? "Cập nhật bài viết" : "Viết bài viết mới"}</h3>
        <Row gutter={24}>
          {/* Cột bên trái cho nhập nội dung và hình ảnh */}
          <Col xs={24} md={17}>
            <Form form={form} onFinish={handleFinish} layout="vertical" className='bg-[#f3f4f6]'>
              <div className='p-5'>
                <div className="flex flex-col space-y-4">
                  {/* Nội dung bài viết */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-2">Nội dung bài viết</label>
                    <div className='relative'>
                      <Form.Item
                        name="content"
                        rules={[
                          {
                            required: true,
                            message: 'Vui lòng nhập nội dung bài viết',
                          },
                          {
                            min: 10,
                            message: 'Nội dung bài viết phải có ít nhất 10 ký tự!',
                          },
                          {
                            max: 2000,
                            message: 'Nội dung bài viết không được quá 2000 ký tự!',
                          },
                        ]}
                      >
                        <TextArea
                          ref={textAreaRef}
                          onClick={handleCursorChange} // Lưu vị trí con trỏ khi click
                          onKeyUp={handleCursorChange} // Lưu vị trí con trỏ khi gõ phím
                          autoSize={true}
                          className="border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 text-[20px] !leading-7 !min-h-[200px] !max-h-[600px] p-5"
                          placeholder="Nhập nội dung bài viết"
                        />
                      </Form.Item>
                      <SmileOutlined className='absolute right-5 bottom-10 text-[20px]' />
                    </div>
                  </div>
                  <div className='p-5 bg-white rounded-md border !mt-0'>
                    <Form.Item>
                      <div className="flex flex-col">
                        {/* Label nằm trên ảnh */}
                        <label className="mb-2 text-sm font-medium text-gray-700">Hình ảnh sản phẩm</label>

                        {/* Upload component */}
                        <Upload
                          listType="picture-card"
                          customRequest={handleUpload}
                          fileList={fileList}
                          onChange={handleFileChange}
                          onRemove={handleRemove}
                          multiple
                          onPreview={handlePreview}
                        >
                          <div>
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                          </div>
                        </Upload>
                      </div>
                    </Form.Item>
                  </div>
                </div>
              </div>
            </Form>
          </Col>
          {/* Cột bên phải cho chọn chủ đề */}
          <Col xs={24} md={7} className='bg-white !p-5'>
            <div className="flex flex-col space-y-4 mb-5">
              <h3 className='text-2xxl font-bold'>Quản lý bài viết</h3>
              <Button
                type="dashed"
                icon={<SearchOutlined />}
                onClick={handleProductModalOpen}
              >
                {selectedProduct ? 'Thay đổi sản phẩm' : 'Chọn sản phẩm'}
              </Button>
              <div className="flex flex-wrap overflow-y-auto gap-2" style={{ maxHeight: '270px' }}>
                {
                  selectedProduct?.images?.map((src, index) => (
                    <div key={index} className="relative cursor-pointer" onClick={() => handleAddImage(src)}
                    >
                      <Avatar
                        shape="square"
                        size={100}
                        src={src}
                        style={{ flexShrink: 0 }}
                      />
                      {selectedImages.includes(src) && (
                        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center rounded-md">
                          <CheckCircleOutlined className="text-white text-3xl" />
                        </div>
                      )}
                    </div>
                  ))
                }
              </div>

              {/* Chọn chủ đề */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-2">Chọn chủ đề</label>
                <Select
                  showSearch
                  optionFilterProp="label"
                  value={formData.topic}
                  onChange={(value) => setFormData((prev) => ({ ...prev, topic: value }))}
                  onSearch={handleFetchTopics} // Bắt sự kiện tìm kiếm
                  className="w-full h-12 border rounded-lg"
                  placeholder="Chọn chủ đề"
                  loading={isLoading} // Hiển thị trạng thái tải
                  onFocus={()=>handleFetchTopics()}
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                  }
                  notFoundContent={searchValue && topics.length === 0 &&
                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      onClick={handleCreateTopic}
                      style={{ width: '100%' }}
                    >
                      Tạo chủ đề mới
                    </Button>
                  }
                  options={topics.map(topic => ({ value: topic.id, label: topic.name }))}
                />
              </div>
            </div>
            {/* Hiển thị emoji picker khi người dùng nhấn nút */}
            <Picker data={data} onEmojiSelect={addEmoji} locale={`vi`} />
          </Col>
        </Row>
        <Modal
          visible={visibleProducts}
          onCancel={handleCancelSelectProduct}
          width={1200}
          footer={[
            <Button key="cancel" onClick={handleCancelSelectProduct} className="text-gray-500">
              Hủy
            </Button>,
            <Button key="submit" type="primary" onClick={handleSelectedProduct}>
              Chọn sản phẩm
            </Button>,
          ]}
        >
          <h3 className='text-[18px] font-bold mb-3'>Chọn sản phẩm để viết nội dung</h3>
          <ProductFilter setLoading={setLoadingProduct} setProducts={setProducts} />
          <Row gutter={[16, 16]}>
            {products.map((product) => (
              <Col
                key={product.id}
                xs={24} sm={12} md={8} lg={6} // Responsive cột theo kích thước màn hình
              >
                <ProductCard product={product} setSelectedProduct={setSelectedTempProduct} selectedProduct={selectedTempProduct} />
              </Col>
            ))}
            {products.length === 0 && <div className="flex justify-center items-center flex-col p-6 mx-auto">
              <FrownOutlined className="text-4xl text-gray-500 animate-bounce mb-4" />
              <h3 className="text-center text-lg text-gray-700 font-semibold">
                Không có sản phẩm nào được tìm thấy
              </h3>
            </div>}
          </Row>
        </Modal>

      </Modal>
      <Modal
        visible={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <div style={{ padding: "20px" }}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </div>
      </Modal>
    </>
  );
};

export default AddContentModal;
