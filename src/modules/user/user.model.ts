import { Schema, model } from "mongoose"
import { UserInterface } from "./user.interface"
import { NextFunction } from "express"
import { hashPassword } from "./user.service"

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

userSchema.pre("save", async function () {

  if (!this.isModified("password")) {
    return
  }

  this.password = await hashPassword(this.password)

})

const UserModel = model<UserInterface>("User", userSchema)

export default UserModel