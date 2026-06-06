import { UserService } from "../services/index.js";
import userService from "../services/user.service.js";
import { isValidIndianPhone } from "../utills/validations.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });

    }
    console.log("phone number starting")

    const check_phone_error = isValidIndianPhone(phone);

    if (!check_phone_error) {
      return res.status(409).json({
        success: false,
        message: "Invalid phone number 😑",
      });
    }

    const existingUser = await UserService.findByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    const user = await UserService.createUser({
      name,
      email,
      password,
      phone,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error in register user api" + error,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await UserService.getAllUsers();

    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const deleteUserByEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const existingUser = await UserService.findByEmail(email);

    if (!existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email don't Exist ✋",
      });
    }

    const user_deleted = userService.deleteUserByEmail(email);

    if (user_deleted) {
      return res.status(210).json({
        success: true,
        message: "User deleted ",
      });
    }
    else{
      return res.status(400).json({
        success: false,
        message: "User could not be deleted.. ",
      });
    }
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "INTERNAL SERVER ERROR WHILE DELETING USER => "+ error,
    });
  }
};
