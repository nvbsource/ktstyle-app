const express = require('express')
const multer = require('multer')
const path = require('path')

const router = express.Router()

// Cấu hình multer để lưu ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/') // Thư mục lưu ảnh
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`)
  },
})

const upload = multer({ storage })

router.post('/', upload.single('file'), (req, res) => {
  const fileUrl = `http://localhost:5005/uploads/${req.file.filename}`
  res.json({ url: fileUrl })
})

module.exports = router
