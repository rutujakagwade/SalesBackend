// utils/sendCredentials.js
import nodemailer from "nodemailer";

export async function sendCredentials({ to, subject, html }) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: +process.env.SMTP_PORT || 587,
      secure: (+process.env.SMTP_PORT || 587) === 465, // TLS if 465
      auth: {
        user: process.env.SMTP_USER, // your Gmail
        pass: process.env.SMTP_PASS  // Gmail app password
      }
    });

    const info = await transporter.sendMail({
      from: `"${process.env.CLIENT_NAME || "CASE"}" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html
    });

    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Email error:", error.message);
    throw error;
  }
}
