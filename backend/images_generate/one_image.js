const sharp = require('sharp');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');
const db = require('../config/dbRepository'); // Import kết nối đến database
const { formatNumberToCurrency } = require('../helpers/helpers');

// Hàm tạo HTML hiển thị thông tin sản phẩm
const createPriceHTML = (product) => {
  // Đường dẫn tới file template HTML
  const templatePath = path.join(__dirname, '/template/one_image.html');

  // Đọc file template HTML đồng bộ
  const template = fs.readFileSync(templatePath, 'utf-8');

  // Thay thế các placeholder bằng dữ liệu từ object `product`
  const htmlContent = template
    .replace('[image]', product.image) // Thay thế placeholder [image]
    .replace('[name]', product.name) // Thay thế placeholder [name]
    .replace('[rentai_price]', product.rental_price) // Thay thế placeholder [rentai_price]
    .replace('[old_price]', product.old_price); // Thay thế placeholder [old_price]

  return htmlContent; // Trả về HTML đã được inject dữ liệu
};

// Hàm tạo hình ảnh từ HTML
const generatePriceImage = async (product, outputFile) => {
  const htmlContent = createPriceHTML(product);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Đặt kích thước viewport cho Puppeteer
  await page.setViewport({
    width: 1080, // Chiều rộng
    height: 1920, // Chiều cao
    deviceScaleFactor: 2, // Đảm bảo ảnh sắc nét
  });

  // Render nội dung HTML
  await page.setContent(htmlContent);

  // Chụp ảnh sản phẩm
  const element = await page.$('.card');
  await element.screenshot({ path: outputFile, omitBackground: true });

  await browser.close();
};

// Hàm xử lý ảnh của từng sản phẩm
const processSingleImage = async (product, uploadsDir, outputDir) => {
  try {
    const filename = path.basename(product.image); // Tên file ảnh
    const inputFilePath = path.join(uploadsDir, filename);

    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
    const outputFilePath = path.join(outputDir, `KTStyle_${product.id}_${randomString}.png`);

    if (fs.existsSync(inputFilePath)) {
      // Tạo file PNG từ thông tin sản phẩm
      await generatePriceImage(product, outputFilePath);
      console.log(`Đã xử lý ảnh: ${outputFilePath}`);
    } else {
      console.warn(`Không tìm thấy file ảnh: ${inputFilePath}`);
    }
  } catch (err) {
    console.error(`Lỗi khi xử lý ảnh cho sản phẩm ${product.id}:`, err);
  }
};

// Hàm xử lý hàng loạt ảnh sản phẩm từ DB
const processImages = async () => {
  try {
    const products = await db.getAll('Products'); // Lấy danh sách sản phẩm từ DB
    const uploadsDir = path.join(__dirname, './uploads'); // Thư mục chứa ảnh gốc
    const outputDir = path.join(__dirname, './processed-images'); // Thư mục lưu ảnh kết quả

    if (!fs.existsSync(outputDir)) {
      fse.ensureDirSync(outputDir); // Tạo thư mục nếu chưa tồn tại
    }

    const pLimit = await import('p-limit').then((mod) => mod.default);
    const limit = pLimit(5); // Giới hạn xử lý 5 sản phẩm cùng lúc

    const tasks = [];
    for (const product of products.data) {
      if (product.thumbnail && product.rental_price && product.rental_price > 0) {
        tasks.push(
          limit(() =>
            processSingleImage(
              {
                id: product.id,
                name: product.name,
                image: product.thumbnail,
                rental_price: product.rental_price,
                old_price: product.rental_price,
              },
              uploadsDir,
              outputDir
            )
          )
        );
      }
    }

    // Thực hiện xử lý ảnh song song
    await Promise.all(tasks);

    console.log('Hoàn thành xử lý ảnh cho tất cả sản phẩm.');
  } catch (err) {
    console.error('Có lỗi xảy ra:', err);
  }
};

// Thực thi
processImages();