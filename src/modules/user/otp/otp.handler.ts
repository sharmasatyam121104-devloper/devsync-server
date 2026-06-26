import { otpTemplate } from "../../../templates/otpTemplate";
import sendMail from "../../../utils/sendEmail";

export const handleOtp = async (email: string, otp: string) => {
  console.log("🔥 OTP Handler Called:", email, otp);
  await sendMail(
    email,
    "Verify Your DevSync Account",
    otpTemplate(otp)
  );
};