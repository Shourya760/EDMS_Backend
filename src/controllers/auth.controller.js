import { UserService } from "../services/index.js";
import userService from "../services/user.service.js";
import { isValidIndianPhone } from "../utills/validations.js";
import { uploadToCloudinary } from "../utills/uploadToCloudinary.js";
import { comparePassword, encryptPassword } from "../utills/password.util.js";
import { generateToken } from "../utills/jwt.js";
import { response } from "express";



export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    console.log("FILE TYPE OF REQ.FILE: ", req.file)

    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });

    }
    console.log("debugger1")
    const check_phone_error = isValidIndianPhone(phone)
    if (!check_phone_error) {
      return res.status(409).json({
        success: false,
        message: "Invalid phone number 😑",
      });
    }
    console.log("debugger2")

    const existingUser = await UserService.findByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    let documentUrl = "";
    if (req.file) {
      const uploadedFile = await uploadToCloudinary(req.file.buffer);
      documentUrl = uploadedFile.url
    }

    const hashedPassword = await encryptPassword(password);
    const user = await UserService.createUser({
      name,
      email,
      password: hashedPassword,
      phone,
      profile_image: documentUrl
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
    else {
      return res.status(400).json({
        success: false,
        message: "User could not be deleted.. ",
      });
    }
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "INTERNAL SERVER ERROR WHILE DELETING USER => " + error,
    });
  }
};

export const loginUser = async (req, res) => {
  try {

    // step1 : fetch email and password.
    const { email, password } = req.body

    console.log("debbbug 1");
    // step2 : check both email and password.
    if (!email || !password) {
      return res.status(400).json(
        {
          status: false,
          message: "EMAIL OR PASSWORD NOT ENTERERD"
        }
      )
    }
    console.log("debbbug 2");
    // step3 : check if email exist in db.
    // step3.1 : if email don't exist returns error.
    const email_check = await userService.findByEmail(email);

    if (!email_check) {
      return res.status(404).json(
        {
          status: false,
          message: "Email dont exists"
        }
      )
    }

    console.log("debbbug 3");

    console.log(password);
    console.log(email_check.password);


    const is_password_correct = await comparePassword(password, email_check.password)
    // aditya@gmail.com , 123456
    // step4 : check if password is correct fro the given email.
    // const check_email_password = await userService.findByEmailAndPassword(email, password);

    // Generate JWT
    const token = generateToken({
      id: email_check._id,
      email: email_check.email,
      name: email_check.name
    });

    console.log("debbbug 4");
    if (!is_password_correct) {
      return res.status(403).json(
        {
          status: false,
          message: "EMAIL OR PASSWORD IS INCORRECT"
        }
      )
    }
    else {
      return res.status(200).json({
        status: true,
        message: "LOGIN SUCCESSFUL",
        token,
        user: {
          id: email_check._id,
          email: email_check.email,
          name: email_check.name
        }

      });
    }

    // step5 : if true login done.
    // step6 : if false returns error massage.

  }
  catch (error) {
    return res.status(450).json(
      {
        status: false,
        message: "Some thing wrong in email or password => " + error
      }
    )
  }
}

export const getUser = async (req, res) => {
  try {

    const { email } = req.body

    const email_check = await userService.findByEmail(email);

    if (!email_check) {
      return res.status(404).json(
        {
          status: false,
          message: "Email dont exists for the user"
        }
      )
    }
    else {
      return res.status(200).json(
        {
          status: true,
          message: "USER INFO RECEIVED",
          data: email_check
        }
      )
    }
  }
  catch (error) {
    return res.status(450).json(
      {
        status: false,
        message: "USER NOT AVAILABLE WITH THIS EMAIL & PASSWORD => " + error
      }
    )
  }
}

export const getUserById = async (req, res) => {
  try {

    const { userId } = req.query;
    const { user_email } = req.query;
    const { phone } = req.query;

    if (userId) {
      const get_user = await userService.findUserById(userId);

      return res.status(200).json({
        success: true,
        message: "User Data Fatched",
        data: get_user
      })
    } else if (user_email) {
      const email_check = await userService.findByEmail(user_email);

      return res.status(200).json({
        success: true,
        message: "User Data Fatched",
        data: email_check
      })
    } else if (phone) {
      const email_check = await userService.findByPhone(phone);

      return res.status(200).json({
        success: true,
        message: "User Data Fatched",
        data: email_check
      })
    }

    return res.status(400).json({
      success: false,
      message: "no PArams passed "
    })

  } catch (error) {
    console.log("Error while getUserById: ", error);
    return res.status(500).json({
      success: false,
      message: "Error while getting User By ID: " + error
    })
  }
}

export const getCurrentUserProfile = async (req, res) => {
  try {
    const current_user = req.user;

    const user_data = await userService.findUserById(current_user.id)

    return res.status(200).json({
      success: true,
      message: " Got the user",
      data: user_data
    })


  }
  catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error in getting Profile" + error
    })

  }
}

export const UpdateUser = async (req, res) => {
  try {
    const id = req.body.id;
    const data = JSON.parse(req.body.data);

    // check if phone number is valid
    if (data.phone) {
      const check_phone_error = isValidIndianPhone(data.phone)
      if (!check_phone_error) {
        return res.status(409).json({
          success: false,
          message: "Invalid phone number 😑",
        });
      }
    };
    // uploading  profile to cloude
    if (req.file) {
      const uploadedFile = await uploadToCloudinary(req.file.buffer);
      data.profile_image = uploadedFile.url;
    }

    const response = await userService.updateById(id, data);


    return res.status(200).json({
      success: true,
      message: "All Done Bro",
      data: response,
    })

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error While Updating User " + Error
    })
  }
}