require('dotenv').config();
const nodemailer = require('nodemailer')



module.exports = async function sendEmail(email, packageType, password) {

  const file = packageType.file

  let transporter = nodemailer.createTransport({
    host: 'smtp.mailgun.org',
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD
    }
  })
  
  await transporter.sendMail({
    from: '"Paywall Tutorial" <noreply@email.com>',
    to: email,
    subject: "Thank you for purchasing!",
    text: `Your password is: ${password}. Your download can be found at: ${file}`
  })
}