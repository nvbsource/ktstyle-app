const sharp = require('sharp')
const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')
const fse = require('fs-extra')
const db = require('../config/dbRepository') // Kết nối tới database

// Hàm tạo HTML hiển thị thông tin sản phẩm
const createPriceHTML = (product) => {
  // Đường dẫn tới file template HTML
  const templatePath = path.join(__dirname, '../template/4_image.html')

  // Kiểm tra xem file template có tồn tại không
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template file not found: ${templatePath}`)
  }

  // Đọc file template HTML đồng bộ
  const template = fs.readFileSync(templatePath, 'utf-8')

  // Tính toán giá thuê
  const rentalPrice = product.rental_price > 0 ? product.rental_price : 0

  // Thay thế các placeholder bằng dữ liệu từ object `product`
  return template
    .replace('[id]', product.id || '')
    .replace('[image_1]', product.image1 || '')
    .replace('[image_2]', product.image2 || '')
    .replace('[image_3]', product.image3 || '')
    .replace('[image_4]', product.image4 || '')
    .replace('[content]', `${rentalPrice / 1000}k/ngày - ${product.name}`)
}

// Hàm tạo hình ảnh từ HTML
const generatePriceImage = async (product, outputFile) => {
  try {
    const htmlContent = createPriceHTML(product)

    // Khởi động Puppeteer
    const browser = await puppeteer.launch({
      headless: true, // Chạy không giao diện
      args: ['--no-sandbox', '--disable-setuid-sandbox'], // Cấu hình cho môi trường hạn chế
    })

    const page = await browser.newPage()

    // Đặt kích thước viewport cho Puppeteer
    await page.setViewport({
      width: 1080, // Chiều rộng
      height: 1920, // Chiều cao
      deviceScaleFactor: 2, // Đảm bảo ảnh sắc nét
    })

    // Render nội dung HTML
    await page.setContent(htmlContent)

    // Chọn phần tử `.card` để chụp ảnh
    const element = await page.$('.card')
    if (!element) {
      throw new Error('Không tìm thấy phần tử .card trong HTML')
    }

    // Chụp ảnh và lưu file
    await element.screenshot({ path: outputFile, omitBackground: true })

    await browser.close()
    console.log(`Đã tạo hình ảnh: ${outputFile}`)
  } catch (err) {
    console.error(`Lỗi khi tạo hình ảnh:`, err)
  }
}

// Hàm xử lý ảnh của từng sản phẩm
const processSingleImage = async (product, uploadsDir, outputDir) => {
  try {
    // Đảm bảo các ảnh cần thiết tồn tại
    const images = [
      product.image1,
      product.image2,
      product.image3,
      product.image4,
    ]
    const missingImages = images.filter(
      (image) => !fs.existsSync(path.join(uploadsDir, path.basename(image)))
    )

    if (missingImages.length > 0) {
      console.warn(`Sản phẩm ${product.id} thiếu ảnh:`, missingImages)
      return
    }

    // Tạo tên file ngẫu nhiên
    const randomString = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()
    const outputFilePath = path.join(
      outputDir,
      `KTStyle_${product.id}_${randomString}.png`
    )

    // Tạo file PNG từ thông tin sản phẩm
    await generatePriceImage(product, outputFilePath)
  } catch (err) {
    console.error(`Lỗi khi xử lý ảnh cho sản phẩm ${product.id}:`, err)
  }
}

// Hàm xử lý hàng loạt ảnh sản phẩm từ DB
const processImages = async () => {
  try {
    const products = await db.getAll('Products') // Lấy danh sách sản phẩm từ DB
    const uploadsDir = path.join(__dirname, '../uploads') // Thư mục chứa ảnh gốc
    const outputDir = path.join(__dirname, '../processed-images') // Thư mục lưu ảnh kết quả

    // Đảm bảo thư mục tồn tại
    if (!fs.existsSync(uploadsDir)) {
      throw new Error(`Thư mục ${uploadsDir} không tồn tại`)
    }
    if (!fs.existsSync(outputDir)) {
      fse.ensureDirSync(outputDir) // Tạo thư mục nếu chưa tồn tại
    }

    // Tạo giới hạn xử lý song song
    const pLimit = await import('p-limit').then((mod) => mod.default)
    const limit = pLimit(5) // Giới hạn xử lý 5 sản phẩm cùng lúc

    // Danh sách các tác vụ
    const tasks = []
    for (const product of products.data) {
      if (
        product.thumbnail &&
        product.rental_price &&
        product.rental_price > 0 &&
        Array.isArray(product.images) &&
        product.images.length >= 2
      ) {
        // Hàm trộn mảng và lấy 4 hình ảnh ngẫu nhiên
        const getRandomImages = (images, count) => {
          const shuffled = [...images]
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
          }
          return shuffled.slice(0, count)
        }
        const images = product.images
        const randomImages = getRandomImages(
          images.filter(Boolean),
          images.length < 4 ? 2 : 4
        )
        if (images.length < 4) {
          randomImages.push(randomImages[1])
          randomImages.push(randomImages[0])
        }
        // Thêm tác vụ vào danh sách
        tasks.push(
          limit(() =>
            processSingleImage(
              {
                id: product.id,
                name: product.name,
                image1: randomImages[0],
                image2: randomImages[1],
                image3: randomImages[2],
                image4: randomImages[3],
                rental_price: product.rental_price,
              },
              uploadsDir,
              outputDir
            )
          )
        )
      }
    }

    // Thực hiện xử lý ảnh song song
    await Promise.all(tasks)
    console.log('Hoàn thành xử lý ảnh cho tất cả sản phẩm.')
  } catch (err) {
    console.error('Có lỗi xảy ra:', err)
  }
}

// Thực thi
processImages()
