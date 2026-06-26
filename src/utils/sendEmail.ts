import dotenv from 'dotenv';
dotenv.config();

import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

const sendMail = async (email: string, subject: string, message: string) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Missing EMAIL credentials");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    family: 4,
  } as SMTPTransport.Options);

  await transporter.sendMail({
    from: `DevSync <${process.env.EMAIL_USER}>`,
    to: email,
    subject,
    html: message,
  });
};

export default sendMail;




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