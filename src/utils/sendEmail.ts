import dotenv from 'dotenv';
dotenv.config();


const sendMail = async (email: string, subject: string, message: string) => {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: "DevSync",
        email: process.env.BREVO_EMAIL,
      },
      to: [{ email }],
      subject,
      htmlContent: message,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(JSON.stringify(data));
  }

  return data;
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