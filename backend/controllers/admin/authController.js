const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../../config/dbRepository');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Tìm user trong database
    const userResult = await db.where('users', { username });

    if (userResult.data.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = userResult.data[0];

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Tạo token (JWT)
    const token = jwt.sign({ userId: user.id, username: user.username }, 'your_jwt_secret', {
      expiresIn: '1h', // Token hết hạn sau 1 giờ
    });

    res.json({ token });
  } catch (err) {
    console.error('Error during login:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};