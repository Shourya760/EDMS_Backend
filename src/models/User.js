import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profile_image: {
      type: String,
      required: false
    },
    phone: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Phone number must be exactly 10 digits"],
    },
    address: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: false,
      default: 0
    },
    forgot_password_token: {
      type: String,
      required: false
    },
    token_expiry: {
      type: Date,
      required: false
    }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;