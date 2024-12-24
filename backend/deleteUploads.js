const fs = require('fs');
const path = require('path');
const db = require('./config/dbRepository');

const deleteUnusedImages = async () => {
    try {
      // Bước 1: Lấy tất cả dữ liệu từ bảng Products
      const products = await db.getAll('Products');
      const imageUrls = new Set();
      
      // Bước 2: Duyệt qua dữ liệu để lấy danh sách URL hình ảnh
      products.data.forEach((product) => {
        if (product.images) {
          try {
            const images = product.images; // Parse JSON mảng URL
            images.forEach((url) => {
              const filename = path.basename(url); // Lấy tên file từ URL
              imageUrls.add(filename); // Thêm tên file vào danh sách
            });
          } catch (err) {
            console.error(`Lỗi khi parse JSON từ cột image:`, err);
          }
        }
      });
      
  
      // Bước 3: Lấy danh sách file trong thư mục uploads
      const uploadsDir = path.join(__dirname, '/uploads');
      const filesInUploads = fs.readdirSync(uploadsDir);
  
      // Bước 4: So sánh và xóa file không nằm trong danh sách URL
      filesInUploads.forEach((file) => {
        if (!imageUrls.has(file)) {
          const filePath = path.join(uploadsDir, file);
          fs.unlinkSync(filePath); // Xóa file
          console.log(`Đã xóa file không được sử dụng: ${file}`);
        }
      });
  
      console.log('Hoàn thành việc xóa các file không sử dụng.');
    } catch (err) {
      console.error('Có lỗi xảy ra:', err);
    }
  };
  
  // Thực thi hàm
  deleteUnusedImages();