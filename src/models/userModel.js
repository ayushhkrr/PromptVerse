import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import Prompt from "./promptModel.js";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Name is required"],
      minlength: [4, "Full Name must be at least 4 characters long"],
      trim: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value) => {
          return !/\s/.test(value);
        },
        message: "Username should not have any spaces",
      },
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: "Enter a valid email",
      },
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      validate: {
        validator: validator.isStrongPassword,
        message: "Enter a strong password",
      },
      select: false,
    },
    role: {
      type: String,
      enum: ["buyer", "seller", "admin"],
      default: "buyer",
    },
    status: {
      type: String,
      enum: ["active", "banned", "deleted"],
      default: "active",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    this.password = bcrypt.hashSync(this.password, 10);
    next();
  } catch (e) {
    console.error("Error hashing password", e);
    next(e);
  }
});

userSchema.pre("findOneAndDelete", async function (next) {
  try {
    const user = await this.model.findOne(this.getFilter());
    await Prompt.deleteMany({ user: user._id });
    next();
  } catch (e) {
    next(e);
  }
});

const User = mongoose.model("User", userSchema);

export default User;
