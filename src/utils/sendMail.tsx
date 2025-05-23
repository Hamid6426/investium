import nodemailer from "nodemailer";

interface MailOptions {
  to: string;
  subject: string;
  text: string;
}

const sendMail = async ({ to, subject, text }: MailOptions) => {
  try {
    // Create a transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // e.g., "smtp.gmail.com"
      port: Number(process.env.SMTP_PORT) || 587, // Default SMTP port
      secure: false, // Use TLS
      auth: {
        user: process.env.SMTP_USER, // Your SMTP username
        pass: process.env.SMTP_PASS, // Your SMTP password
      },
    });

    // Send the email
    await transporter.sendMail({
      from: `"Your App Name" <${process.env.SMTP_USER}>`, // Sender address
      to, // Recipient address
      subject, // Subject line
      text, // Plain text body
    });

    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email.");
  }
};

export default sendMail;