import dotenv from 'dotenv';
dotenv.config();

import nodemailer from "nodemailer";

const sendMail = async (email: string, subject: string, message: string) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("EMAIL credentials missing in environment variables");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // TLS use hoga
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 15000,
    socketTimeout: 15000,
  });

  await transporter.verify(); // connection check (important)

  await transporter.sendMail({
    from: `DevSync <${process.env.EMAIL_USER}>`,
    to: email,
    subject,
    html: message,
  });
};

export default sendMail;

// export default sendMail



// import { Resend } from "resend";

// const resendKey = process.env.RESEND_API_KEY;

// if (!resendKey) {
//   throw new Error("RESEND_API_KEY is missing in environment variables");
// }

// const resend = new Resend(resendKey);

// const sendMail = async (email: string, subject: string, message: string) => {
//   try {
//     const result = await resend.emails.send({
//       from: "DevSync <onboarding@resend.dev>",
//       to: email,
//       subject,
//       html: message,
//     });

//     if (result.error) {
//       throw result.error;
//     }

//     return result;
//   } catch (error) {
//     console.log("Email Error:", error);
//     throw error;
//   }
// };

// export default sendMail;