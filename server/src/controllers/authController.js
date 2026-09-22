// src/controllers/authController.js
const jwt = require('jsonwebtoken');
const emailService = require('../services/emailService');
const userService = require('../services/userService');
const { JWT_SECRET } = require('../config/env');

/**
 * Register new user
 */
async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({ error: 'Tên người dùng và mật khẩu là bắt buộc' });
    }

    // Create user
    const user = userService.createUser({ username, email, password });

    // Send welcome email if email provided
    if (user.email) {
      await emailService.sendWelcomeEmail(user.email, user.username);
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.created_at,
      },
      token,
    });
  } catch (error) {
    console.error('Lỗi tạo người dùng:', error);

    if (error.message === 'USER_EXISTS') {
      return res.status(409).json({ error: 'Tên người dùng này đã được sử dụng' });
    }

    res.status(500).json({ error: 'Tạo tài khoản thất bại' });
  }
}

/**
 * Forgot password
 */
async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email là bắt buộc' });
    }

    const user = userService.getUserByEmail(email);
    // Even if user not found, return 200 to prevent enumeration, but log it
    if (!user) {
      console.log(`[Forgot Password] User not found for email: ${email}`);
      return res.json({ message: 'Nếu email tồn tại, hướng dẫn đặt lại mật khẩu đã được gửi.' });
    }

    // Generate reset token
    const token = jwt.sign(
      { id: user.id, type: 'reset' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const resetLink = `http://localhost:5173/reset-password?token=${token}`;

    // Send reset email
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await emailService.sendResetPasswordEmail(email, resetLink);
    } else {
      // Mock sending via service (if needed, or service handles it internally)
      await emailService.sendResetPasswordEmail(email, resetLink);
    }

    res.json({ message: 'Nếu email tồn tại, hướng dẫn đặt lại mật khẩu đã được gửi.' });
  } catch (error) {
    console.error('Lỗi yêu cầu đặt lại mật khẩu:', error);
    // Return a generic error to the client, but log the real one
    res.status(500).json({ error: 'Xử lý thất bại: ' + (error.message || 'Internal Server Error') });
  }
}

/**
 * Reset password
 */
async function resetPassword(req, res) {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Yêu cầu token và mật khẩu mới' });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.type !== 'reset') {
      return res.status(400).json({ error: 'Token không hợp lệ' });
    }

    // Update password
    userService.updatePassword(decoded.id, newPassword);

    res.json({ message: 'Đặt lại mật khẩu thành công' });
  } catch (error) {
    console.error('Lỗi thực thi đặt lại mật khẩu:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ error: 'Token đã hết hạn' });
    }
    res.status(500).json({ error: 'Đặt lại mật khẩu thất bại' });
  }
}

/**
 * Login user
 */
async function login(req, res) {
  try {
    const { username, password } = req.body;

    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({ error: 'Tên người dùng và mật khẩu là bắt buộc' });
    }

    // Verify credentials
    const user = userService.verifyUser(username, password);

    if (!user) {
      return res.status(401).json({ error: 'Đăng nhập thất bại: Sai thông tin tài khoản hoặc mật khẩu' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    res.status(500).json({ error: 'Đăng nhập thất bại' });
  }
}

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};
