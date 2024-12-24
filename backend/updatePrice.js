const sharp = require('sharp')
const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')
const fse = require('fs-extra')
const db = require('./config/dbRepository')
const { formatNumberToCurrency } = require('./helpers/helpers')

// Đọc tệp ảnh và chuyển đổi thành chuỗi base64
const imagePath = '/Users/nguyenvanbao/Documents/KT-Style/Souce Code/Quan-ly-quan-ao/backend/s.webp';
const imageBase64 = fs.readFileSync(imagePath).toString('base64');

// Tạo src cho thẻ img
const imageSrc = `data:image/webp;base64,${imageBase64}`;

// Hàm tạo HTML hiển thị giá tiền
const createPriceHTML = (priceText) => {
  return `
   <!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- Google Fonts Link -->
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: transparent;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        font-family: 'Poppins', sans-serif; /* Apply Poppins to the body */
      }
      .price-container {
        display: inline-block;
        position: relative;
        border-radius: 12px;
        font-family: 'Poppins', sans-serif;
        font-weight: 500;
        color: black;
        padding: 10px;
        text-align: center;
      }
      .price-container img {
        display: block;
        max-width: 100%;
        height: auto;
        border-radius: 12px;
      }
      .price-container span {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 5px 10px;
        border-radius: 8px;
        font-size: 100px;
        color: rgb(107, 84, 74);
      }
    </style>
  </head>
  <body>
    <div class="price-container">
      <img src="${imageSrc}" alt="Product Image" />
      <span>${priceText}</span>
    </div>
  </body>
</html>
  `
}

// Hàm tạo hình ảnh giá tiền (HTML thành PNG)
const generatePriceImage = async (priceText, outputFile) => {
  const htmlContent = createPriceHTML(priceText)

  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  // Render HTML
  await page.setContent(htmlContent)

  // Chụp ảnh khối giá tiền
  const element = await page.$('.price-container')
  await element.screenshot({ path: outputFile, omitBackground: true })

  await browser.close()
}

// Hàm thay đổi kích thước ảnh giá tiền
const resizePriceImage = async (priceImagePath, maxWidth) => {
  const metadata = await sharp(priceImagePath).metadata()

  if (metadata.width > maxWidth) {
    const roundedMaxWidth = Math.round(maxWidth)

    // Tạo đường dẫn tạm cho file resized
    const tempFilePath = priceImagePath.replace('.png', '_resized.png')

    // Resize và lưu vào file tạm
    await sharp(priceImagePath)
      .resize({ width: roundedMaxWidth })
      .toFile(tempFilePath)

    // Ghi đè file gốc bằng file tạm (nếu cần)
    fs.renameSync(tempFilePath, priceImagePath)
  }
}

// Hàm xử lý một ảnh
const processSingleImage = async (product, imageUrl, uploadsDir, outputDir) => {
  try {
    const filename = path.basename(imageUrl) // Lấy tên file từ đường dẫn
    const inputFilePath = path.join(uploadsDir, filename)

    const randomString = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()
    const newFilename = `KTStyle_${product.id}_${randomString}.jpg`
    const outputFilePath = path.join(outputDir, newFilename)

    if (fs.existsSync(inputFilePath)) {
      const idText = `#KTS_${product.id} `
      const priceText = `${formatNumberToCurrency(product.rental_price)}đ`

      // Tạo file PNG cho giá tiền
      const priceImagePath = path.join(outputDir, `price_${randomString}.png`)
      const priceImageIDPath = path.join(outputDir, `id_${randomString}.png`)

      await generatePriceImage(priceText, priceImagePath)
      await generatePriceImage(idText, priceImageIDPath)

      // Lấy kích thước ảnh gốc
      const metadata = await sharp(inputFilePath).metadata()

      // Resize ảnh giá tiền nếu cần
      await resizePriceImage(priceImagePath, metadata.width * 0.25)
      await resizePriceImage(priceImageIDPath, metadata.width * 0.25)

      // Lấy chiều rộng của ảnh gốc và ảnh giá tiền
      const priceImageMetadata = await sharp(priceImagePath).metadata()
      const leftPosition = metadata.width - priceImageMetadata.width - 60 // Cách phải 20px

      // Chèn ảnh giá tiền vào ảnh gốc
      await sharp(inputFilePath)
        .composite([
          {
            input: priceImagePath,
            top: 50, // Cách trên 20px
            left: leftPosition, // Cách phải 20px
          },
          {
            input: priceImageIDPath,
            top: 50,
            left: 60,
          },
        ])
        .toFile(outputFilePath)

      console.log(`Đã xử lý ảnh: ${outputFilePath}`)

      // Xóa file tạm (ảnh giá tiền)
      fs.unlinkSync(priceImagePath)
      fs.unlinkSync(priceImageIDPath)
    } else {
      console.warn(`Không tìm thấy file ảnh: ${inputFilePath}`)
    }
  } catch (err) {
    console.error(`Lỗi khi xử lý ảnh cho sản phẩm ${product.id}:`, err)
  }
}

// Hàm xử lý ảnh song song với p-limit
const processImages = async () => {
  try {
    const products = await db.getAll('Products') // Lấy danh sách sản phẩm từ database
    const uploadsDir = path.join(__dirname, './uploads') // Thư mục ảnh gốc
    const outputDir = path.join(__dirname, './processed-images') // Thư mục lưu ảnh đã xử lý

    if (!fs.existsSync(outputDir)) {
      fse.ensureDirSync(outputDir) // Tạo thư mục nếu chưa tồn tại
    }
    const pLimit = await import('p-limit').then((mod) => mod.default)

    // Khởi tạo p-limit với số luồng tối đa
    const limit = pLimit(5) // Giới hạn 5 luồng xử lý đồng thời

    // Tạo danh sách Promise cho từng ảnh
    const tasks = []
    for (const product of products.data) {
      if (product.images && product.rental_price && product.rental_price > 0) {
        const images = product.images // Mảng JSON đã được parse
        for (const imageUrl of images) {
          // Thêm từng công việc xử lý ảnh vào danh sách với giới hạn luồng
          tasks.push(
            limit(() =>
              processSingleImage(product, imageUrl, uploadsDir, outputDir)
            )
          )
        }
      }
    }

    // Thực hiện xử lý ảnh song song với giới hạn p-limit
    await Promise.all(tasks)

    console.log('Hoàn thành xử lý ảnh cho tất cả sản phẩm.')
  } catch (err) {
    console.error('Có lỗi xảy ra:', err)
  }
}

// Thực thi
processImages()
