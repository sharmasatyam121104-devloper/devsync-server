import { otpTemplate } from "../../../templates/otpTemplate";
import sendMail from "../../../utils/sendEmail";

export const handleOtp = async (email: string, otp: string) => {
  await sendMail(
    email,
    "Verify Your DevSync Account",
    otpTemplate(otp)
  );
};