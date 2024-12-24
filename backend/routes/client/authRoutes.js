const express = require('express')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const { generateToken } = require('../../helpers/jwtHelpers')
const db = require('../../config/dbRepository')
const verifyToken = require('../../middlewares/authMiddleware')
const {
  successResponse,
  errorResponse,
} = require('../../helpers/responseHelper')

const router = express.Router()

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID || '4029336987294654'
const FACEBOOK_APP_SECRET =
  process.env.FACEBOOK_APP_SECRET || '3bef57954699d1c44f7cd4560d515bb0'

router.post('/facebook', async (req, res) => {
  const { accessToken } = req.body

  if (!accessToken) {
    return errorResponse('Access token không tồn tại!', 400)
  }

  try {
    // 1. Xác thực accessToken với Facebook bằng Debug Token API
    const debugTokenResponse = await axios.get(
      `https://graph.facebook.com/debug_token`,
      {
        params: {
          input_token: accessToken,
          access_token: `${FACEBOOK_APP_ID}|${FACEBOOK_APP_SECRET}`,
        },
      }
    )

    const { is_valid, user_id } = debugTokenResponse.data.data

    if (!is_valid) {
      return errorResponse('Access token không hợp lệ!', 401)
    }

    // 2. Lấy thông tin người dùng từ Facebook Graph API
    const userResponse = await axios.get(
      `https://graph.facebook.com/${user_id}?fields=id,name,email,link`,
      {
        params: { access_token: accessToken },
      }
    )

    const user = userResponse.data

    // 3. Lấy URL ảnh đại diện từ Facebook (với redirect=false)
    const avatarResponse = await axios.get(
      `https://graph.facebook.com/${user.id}/picture`,
      {
        params: {
          access_token: accessToken,
          redirect: false,
          width: 200,
          height: 200,
        },
      }
    )

    const avatarUrl = avatarResponse.data.data.url

    const jwtToken = generateToken({ username: user.id, typeLogin: 'facebook' })

    const userExists = (
      await db.where('Customers', { id_facebook: user.id })
    ).first()

    if (!userExists) {
      await db.create('Customers', {
        id_facebook: user.id,
        email: user.email,
        name: user.name,
        avatar: avatarUrl,
      })
    }

    successResponse(res, 'Đăng nhập thành công!', {
      token: jwtToken,
      user: {
        name: user.name,
        avatar: avatarUrl,
      },
    })
  } catch (error) {
    console.error('Lỗi khi xác thực token:', error.message)
    errorResponse(res, 'Xác thực thất bại!', 500)
  }
})

router.get('/profile', verifyToken, async (req, res) => {
  const { username, typeLogin } = req.user

  try {
    const user = (
      await db.where('Customers', {
        [typeLogin === 'facebook' ? 'id_facebook' : 'phone']: username,
      })
    ).first()

    if (!user) {
      return errorResponse(res, 'Không tìm thấy người dùng!', 404)
    }

    successResponse(res, 'Thông tin người dùng lấy thành công!', {
      name: user.name,
      avatar: user.avatar,
    })
  } catch (error) {
    console.error('Lỗi khi lấy thông tin người dùng:', error.message)
    errorResponse(res, 'Lỗi khi lấy thông tin người dùng!', 500)
  }
})

module.exports = router
