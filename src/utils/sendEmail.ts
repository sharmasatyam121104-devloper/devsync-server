import dotenv from 'dotenv';
dotenv.config();

import nodemailer from "nodemailer";

const sendMail = async (email: string, subject: string, message: string) => {
  if (!process.env.BREVO_EMAIL || !process.env.BREVO_SMTP_KEY) {
    throw new Error("Missing Brevo SMTP credentials");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false, // TLS use hoga
    auth: {
      user: process.env.BREVO_EMAIL,
      pass: process.env.BREVO_SMTP_KEY,
    },
  });

  await transporter.sendMail({
    from: `DevSync <${process.env.BREVO_EMAIL}>`,
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