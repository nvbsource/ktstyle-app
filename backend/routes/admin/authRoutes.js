const express = require('express')
const loginController = require('../../controllers/admin/authController')

const router = express.Router()

// Định nghĩa các route cho giỏ hàng
app.post('/auth/login', loginController.login)

module.exports = router
