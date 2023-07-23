import 'dotenv/config'
import { createTransport } from 'nodemailer'

export const sendEmail = async (
  email: string,
  subject: string,
  html: string,
) => {
  try {
    const transporter = createTransport({
      host: process.env.HOST,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    })

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject,
      html,
    })

    console.log('email sent sucessfully')
  } catch (error) {
    console.log(error, 'email not sent')
  }
}
