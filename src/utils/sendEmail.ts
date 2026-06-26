// import nodemailer from "nodemailer"

// const sendMail = async (email: string, subject: string, message: string) => {

//   const transporter = nodemailer.createTransport({
//     service: "gmail",

//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS
//     }
//   })

//   await transporter.sendMail({
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: subject,
//     html: message
//   })
// }

// export default sendMail


import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendMail = async (email: string, subject: string, message: string) => {
  try {
    await resend.emails.send({
      from: "DevSync <onboarding@resend.dev>",
      to: email,
      subject: subject,
      html: message,
    });
  } catch (error) {
    console.log("Email Error:", error);
    throw error;
  }
};

export default sendMail;