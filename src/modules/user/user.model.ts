import { Schema, model } from "mongoose"
import { UserInterface } from "./user.interface"

const userSchema = new Schema<UserInterface>(
  {
    fullname: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    otp: {
      type: String
    },

    otpExpireTime: {
      type: Date
    },

    verify: {
      type: Boolean,
      default: false
    },
    refreshToken: {
      type: String
    },
    refreshTokenExpiry: {
      type: Date
    },
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER"
    }
  },
  {
    timestamps: true
  }
)


const UserModel = model<UserInterface>("User", userSchema)

export default UserModel