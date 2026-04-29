import { otpQueue } from "./otp.queue";

export const addOtpJob = async (userId: string, email: string, otp: string) => {
  await otpQueue.add(
    "sendOtp",
    { userId, email, otp },
    {
      removeOnComplete: true,
      removeOnFail: true,
    }
  );
};