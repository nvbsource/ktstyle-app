import React, { useEffect, useRef, useState } from 'react';
import { Modal, Button, Input, Select, Upload, Checkbox, Row, Col, Form, message, Avatar } from 'antd';
import { CheckCircleOutlined, FrownOutlined, PlusOutlined, SearchOutlined, SmileOutlined, UserOutlined } from '@ant-design/icons';
import { Editor } from '@tinymce/tinymce-react';
import { fetchProducts } from '../services/api';
import ProductCard from './ProductCard';
import ProductFilter from './ProductFilter';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import TextArea from 'antd/es/input/TextArea';

const AddPostModal = ({ visible, onCancel, onCreate }) => {
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

  const [formData, setFormData] = useState({
    content: '',
    category: null,
    files: [],
    isEvergreen: false,
    publishNow: true,
  });

  const handleCursorChange = (e) => {
    setCursorPosition(e.target.selectionStart); // Lưu vị trí con trỏ khi click hoặc gõ phím
  };


  const addEmoji = (emoji) => {
    if (textAreaRef.current) {
      const textArea = textAreaRef.current.resizableTextArea.textArea; // Truy cập phần tử DOM thực tế
      const currentText = formData.content;

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

      setFormData({ ...formData, content: newText });

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

  const handleChangeContent = (e) => {
    setCursorPosition(e.target.selectionStart); // Cập nhật vị trí con trỏ sau mỗi thay đổi
    setFormData((prev) => ({
      ...prev,
      content: e.target.value,
    }));
  };

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

  // Xử lý khi người dùng xem ảnh trước
  const handlePreview = (file) => {
    console.log('Preview', file);
  };

  const handleCancelSelectProduct = () => {
    setVisibleProducts(false);
    setSelectedTempProduct(null)
  }

  const handleSelectedProduct = () => {
    setVisibleProducts(false);
    setSelectedProduct(selectedTempProduct)
  }

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

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel} className="text-gray-500">
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={() => onCreate(formData)}>
          Viết bài mới
        </Button>,
      ]}
      width={1400}
    >
      <h3 className='text-[18px] font-bold mb-3'>Viết bài viết mới</h3>
      <Form className='bg-[#f3f4f6]'>
        <Row gutter={24}>
          {/* Cột bên trái cho nhập nội dung và hình ảnh */}
          <Col xs={24} md={17}>
            <div className='p-5'>
              <div className="flex flex-col space-y-4">
                {/* Nội dung bài viết */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-2">Nội dung bài viết</label>
                  <Form.Item
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
                        max: 500,
                        message: 'Nội dung bài viết không được quá 500 ký tự!',
                      },
                    ]}
                  >
                    <div className='relative'>
                      <TextArea
                        ref={textAreaRef}
                        value={formData.content}
                        onChange={handleChangeContent}
                        onClick={handleCursorChange} // Lưu vị trí con trỏ khi click
                        onKeyUp={handleCursorChange} // Lưu vị trí con trỏ khi gõ phím
                        autoSize={true}
                        className="border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 text-[20px] !leading-6 !min-h-[100px] !max-h-[300px] p-5"
                        placeholder="Nhập nội dung bài viết"
                      />
                      <SmileOutlined className='absolute right-5 bottom-5 text-[20px]'/>
                    </div>

                  </Form.Item>
                </div>
                <div className='p-5 bg-white rounded-md border !mt-0'>
                  <Form.Item
                    name="images"
                    rules={[
                      {
                        validator: (_, value) =>
                          imageUrls.length > 0
                            ? Promise.resolve()
                            : Promise.reject('Vui lòng tải ít nhất một ảnh'),
                      },
                    ]}
                  >
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
          </Col>
          {/* Cột bên phải cho chọn chủ đề */}
          <Col xs={24} md={7} className='bg-white !p-5'>
            <div className="flex flex-col space-y-4 ">
              <h3 className='text-2xxl font-bold'>Quản lý bài viết</h3>
              <Button
                type="dashed"
                icon={<SearchOutlined />}
                onClick={handleProductModalOpen}
              >
                {selectedProduct ? 'Thay đổi sản phẩm' : 'Chọn sản phẩm'}
              </Button>
              <div className="flex flex-wrap overflow-y-auto" style={{ maxHeight: '200px' }}>
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
                  name="category"
                  value={formData.category}
                  onChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                  className="w-full h-12 border rounded-lg"
                  placeholder="Chọn chủ đề"
                >
                  <Select.Option value="1">Chủ đề 1</Select.Option>
                  <Select.Option value="2">Chủ đề 2</Select.Option>
                  <Select.Option value="3">Chủ đề 3</Select.Option>
                </Select>
              </div>
              <h3 className='text-2xxl font-bold text-blue-500'>Tạo một chủ đề mới</h3>
            </div>
            {/* Hiển thị emoji picker khi người dùng nhấn nút */}
            <Picker data={data} onEmojiSelect={addEmoji} locale={`vi`} />
          </Col>
        </Row>
      </Form>
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
  );
};

export default AddPostModal;
