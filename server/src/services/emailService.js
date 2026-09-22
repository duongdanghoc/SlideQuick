const nodemailer = require('nodemailer');
const { EMAIL_USER, EMAIL_PASS } = require('../config/env');

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

/**
 * Send an email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} text - Plain text body
 * @param {string} html - HTML body
 */
const sendEmail = async (to, subject, text, html) => {
  if (!EMAIL_USER || !EMAIL_PASS) {
    console.log('===========================================================');
    console.log(`[MOCK EMAIL] To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${text}`);
    console.log('Use EMAIL_USER and EMAIL_PASS env vars to enable real sending.');
    console.log('===========================================================');
    return;
  }

  try {
    await transporter.sendMail({
      from: '"EduArt AI" <noreply@eduart.ai>',
      to,
      subject,
      text,
      html,
    });
    console.log(`[Email Service] Sent email to ${to}`);
  } catch (error) {
    console.error(`[Email Service] Failed to send email to ${to}:`, error);
  }
};

/**
 * Send welcome email to new user
 * @param {string} to - User's email
 * @param {string} username - User's name
 */
const sendWelcomeEmail = async (to, username) => {
  const subject = 'Chào mừng bạn đến với EduArt AI!';
  const text = `
    Xin chào ${username},

    Cảm ơn bạn đã đăng ký tài khoản EduArt AI!
    Chúng tôi rất vui mừng được đồng hành cùng bạn tạo ra những bài thuyết trình tuyệt vời.

    Nếu bạn có bất kỳ câu hỏi nào, xin vui lòng liên hệ với chúng tôi.
    
    Đội ngũ EduArt AI
  `;
  const html = `
    <h2>Xin chào ${username},</h2>
    <p>Cảm ơn bạn đã đăng ký tài khoản EduArt AI!</p>
    <p>Chúng tôi rất vui mừng được đồng hành cùng bạn tạo ra những bài thuyết trình tuyệt vời.</p>
    <br>
    <p>Nếu bạn có bất kỳ câu hỏi nào, xin vui lòng liên hệ với chúng tôi.</p>
    <p>Đội ngũ EduArt AI</p>
  `;

  await sendEmail(to, subject, text, html);
};

/**
 * Send password reset email
 * @param {string} to - User's email
 * @param {string} resetLink - Password reset link
 */
const sendResetPasswordEmail = async (to, resetLink) => {
  const subject = 'EduArt AI - Đặt lại mật khẩu';
  const text = `Vui lòng nhấp vào liên kết bên dưới để đặt lại mật khẩu của bạn:\n\n${resetLink}\n\nLiên kết này có hiệu lực trong 1 giờ.`;
  const html = `<p>Vui lòng nhấp vào liên kết bên dưới để đặt lại mật khẩu của bạn:</p><p><a href="${resetLink}">${resetLink}</a></p><p>Liên kết này có hiệu lực trong 1 giờ.</p>`;

  await sendEmail(to, subject, text, html);
};

module.exports = {
  sendWelcomeEmail,
  sendResetPasswordEmail,
};
