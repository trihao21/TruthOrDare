import nodemailer from 'nodemailer'

// Create transporter using SMTP configuration
const createTransporter = () => {
  // Check if SMTP configuration is provided
  if (process.env.SMTP_HOST) {
    // Use SMTP configuration
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      },
      tls: {
        // Do not fail on invalid certs
        rejectUnauthorized: process.env.SMTP_REJECT_UNAUTHORIZED !== 'false'
      }
    })
  } else if (process.env.EMAIL_SERVICE) {
    // Fallback to service-based configuration (for backward compatibility)
    return nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    })
  } else {
    throw new Error('Email configuration not found. Please configure SMTP_HOST or EMAIL_SERVICE')
  }
}

export const emailService = {
  // Send mission unlock notification
  async sendMissionUnlockEmail(userEmail, mission) {
    try {
      // Check if SMTP or email service is configured
      const hasSmtpConfig = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD
      const hasServiceConfig = process.env.EMAIL_SERVICE && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD
      
      if (!hasSmtpConfig && !hasServiceConfig) {
        console.warn('Email service not configured. Skipping email send.')
        return { success: false, error: 'Email service not configured' }
      }

      const transporter = createTransporter()

      const startTime = new Date(mission.startTime).toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })

      const endTime = new Date(mission.endTime).toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })

      // Get sender email from SMTP_USER or EMAIL_USER
      const senderEmail = process.env.SMTP_USER || process.env.EMAIL_USER
      const senderName = process.env.EMAIL_FROM_NAME || 'Hipdam Mission'

      const mailOptions = {
        from: `"${senderName}" <${senderEmail}>`,
        to: userEmail,
        subject: `🎉 Nhiệm vụ "${mission.name}" đã được mở khóa!`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #EC4899 0%, #6366F1 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
              }
              .content {
                background: #f9f9f9;
                padding: 30px;
                border-radius: 0 0 10px 10px;
              }
              .mission-card {
                background: white;
                border: 2px solid #6366F1;
                border-radius: 10px;
                padding: 20px;
                margin: 20px 0;
              }
              .mission-title {
                font-size: 24px;
                font-weight: bold;
                color: #6366F1;
                margin-bottom: 15px;
              }
              .mission-detail {
                margin: 10px 0;
                padding: 10px;
                background: #f0f0f0;
                border-radius: 5px;
              }
              .mission-detail strong {
                color: #EC4899;
              }
              .button {
                display: inline-block;
                padding: 15px 30px;
                background: linear-gradient(135deg, #EC4899 0%, #6366F1 100%);
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 20px;
                font-weight: bold;
              }
              .footer {
                text-align: center;
                margin-top: 30px;
                color: #666;
                font-size: 12px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🎉 Nhiệm Vụ Đã Mở Khóa!</h1>
            </div>
            <div class="content">
              <p>Xin chào,</p>
              <p>Chúc mừng! Nhiệm vụ <strong>"${mission.name}"</strong> đã được mở khóa và sẵn sàng để bạn thực hiện.</p>
              
              <div class="mission-card">
                <div class="mission-title">${mission.name}</div>
                <div class="mission-detail">
                  <strong>📍 Địa điểm:</strong> ${mission.location}
                </div>
                <div class="mission-detail">
                  <strong>⏰ Thời gian bắt đầu:</strong> ${startTime}
                </div>
                <div class="mission-detail">
                  <strong>⏱️ Thời gian kết thúc:</strong> ${endTime}
                </div>
                <div class="mission-detail">
                  <strong>👥 Số thành viên cần thiết:</strong> ${mission.requiredMembers} người
                </div>
              </div>

              <p><strong>📸 Hướng dẫn:</strong> Khi đến địa điểm và đủ thành viên, hãy chụp ảnh để check-in. Người chụp cuối cùng hoặc chụp sau thời gian quy định sẽ bị phạt!</p>

              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/mission" class="button">
                  Xem Nhiệm Vụ Ngay
                </a>
              </div>
            </div>
            <div class="footer">
              <p>Hipdam Mission System</p>
              <p>Email này được gửi tự động, vui lòng không trả lời.</p>
            </div>
          </body>
          </html>
        `
      }

      const info = await transporter.sendMail(mailOptions)
      console.log('Mission unlock email sent:', info.messageId)
      return { success: true, messageId: info.messageId }
    } catch (error) {
      console.error('Error sending mission unlock email:', error)
      return { success: false, error: error.message }
    }
  }
}

