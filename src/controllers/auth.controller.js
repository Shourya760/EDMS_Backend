import { UserService } from "../services/index.js";
import { isValidIndianPhone } from "../utills/validations.js";
import { uploadToCloudinary } from "../utills/uploadToCloudinary.js";
import { comparePassword, encryptPassword } from "../utills/password.util.js";
import { generatePasswordToken, generateToken } from "../utills/jwt.js";
import { createHash } from "crypto";
import "../../config/env.js"
import { sendEmail } from "../utills/sendEmail.js";
import userService from "../services/user.service.js";
import {
  welcomeEmail,
  accountStatusEmail,
  forgotPasswordEmail,
  passwordUpdatedEmail,
} from "../emailTamplates/authMails.js";

const safeUser = (user) => {
  const data = user?.toObject ? user.toObject() : user;
  if (!data) return data;
  const { password, forgot_password_token, token_expiry, ...publicUser } = data;
  return publicUser;
};



export const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmpassword, phone, address } = req.body;

    if (!name || !email || !password || !confirmpassword || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });

    }
    const check_phone_error = isValidIndianPhone(phone)
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

    let documentUrl = "";
    if (req.file) {
      const uploadedFile = await uploadToCloudinary(req.file.buffer);
      documentUrl = uploadedFile.url
    }


    let hashedPassword;

    if (password === confirmpassword) {
      hashedPassword = await encryptPassword(password);
    } else {
      return res.status(400).json({
        success: false,
        message: "Password not matching.",
      });
    }


    const user = await UserService.createUser({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      profile_image: documentUrl
    });


    if (user) {
      try {
        const email_info = welcomeEmail(user);

        await sendEmail({
          to: user.email,
          subject: email_info.subject,
          text: email_info.text,
          html: email_info.html,
        });
      } catch (error) {
        console.log("Error in Email =>", error)
      }
      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    }




  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error in register user API",
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

    const user_deleted = await userService.deleteUserByEmail(email);

    if (user_deleted) {
      return res.status(200).json({
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

    // step2 : check both email and password.
    if (!email || !password) {
      return res.status(400).json(
        {
          status: false,
          message: "EMAIL OR PASSWORD NOT ENTERERD"
        }
      )
    }
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

    const is_password_correct = await comparePassword(password, email_check.password)
    // aditya@gmail.com , 123456
    // step4 : check if password is correct fro the given email.
    // const check_email_password = await userService.findByEmailAndPassword(email, password);

    if (!is_password_correct) {
      return res.status(401).json(
        {
          status: false,
          message: "EMAIL OR PASSWORD IS INCORRECT"
        }
      )
    }
    else {
      const token = generateToken({
        id: email_check._id,
        email: email_check.email,
        name: email_check.name
      });
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
    return res.status(500).json(
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
          data: safeUser(email_check)
        }
      )
    }
  }
  catch (error) {
    return res.status(500).json(
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

      if (!get_user) return res.status(404).json({ success: false, message: "User not found" });
      return res.status(200).json({
        success: true,
        message: "User Data Fatched",
        data: safeUser(get_user)
      })
    } else if (user_email) {
      const email_check = await userService.findByEmail(user_email);

      if (!email_check) return res.status(404).json({ success: false, message: "User not found" });
      return res.status(200).json({
        success: true,
        message: "User Data Fatched",
        data: safeUser(email_check)
      })
    } else if (phone) {
      const email_check = await userService.findByPhone(phone);

      if (!email_check) return res.status(404).json({ success: false, message: "User not found" });
      return res.status(200).json({
        success: true,
        message: "User Data Fatched",
        data: safeUser(email_check)
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
    const current_user = req.curr_user;

    const user_data = await userService.findUserById(current_user.id)

    if (!user_data) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: " Got the user",
      data: safeUser(user_data)
    })


  }
  catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error in getting Profile" + error
    })

  }
}

export const updateUser = async (req, res) => {
  try {
    const id = req.body.id;
    const requestedData = JSON.parse(req.body.data);

    const data = {};
    for (const field of ["name", "phone", "address"]) {
      if (requestedData[field] !== undefined) data[field] = requestedData[field];
    }

    if (!id || id !== req.curr_user.id) {
      return res.status(403).json({ success: false, message: "You can only update your own profile" });
    }

    // Check phone number
    if (data.phone) {
      const check_phone_error = isValidIndianPhone(data.phone);

      if (!check_phone_error) {
        return res.status(409).json({
          success: false,
          message: "Invalid phone number 😑",
        });
      }
    }

    // Get old user before updating
    const oldUser = await userService.findUserById(id);

    if (!oldUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Upload profile image
    if (req.file) {
      const uploadedFile = await uploadToCloudinary(req.file.buffer);
      data.profile_image = uploadedFile.url;
    }


    // Update user
    const response = await userService.updateById(id, data);

    return res.status(200).json({
      success: true,
      message: "All Done Bro",
      data: safeUser(response),
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error While Updating User => " + error.message,
    });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (typeof status !== "boolean") {
      return res.status(400).json({ success: false, message: "Status must be true or false" });
    }
    if (String(req.curr_user.id) === userId && status === false) {
      return res.status(400).json({ success: false, message: "You cannot deactivate your own account" });
    }

    const user = await userService.findUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    const updatedUser = await userService.updateById(userId, { status });

    try {
      const emailInfo = accountStatusEmail(updatedUser, status);
      await sendEmail({
        to: updatedUser.email,
        subject: emailInfo.subject,
        text: emailInfo.text,
        html: emailInfo.html,
      });
    } catch (emailError) {
      console.error("Could not send account-status email:", emailError.message);
    }

    return res.status(200).json({
      success: true,
      message: `Admin account ${status ? "activated" : "deactivated"}`,
      data: safeUser(updatedUser),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not update admin status" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email not found"
      })
    }

    const user = await UserService.findByEmail(email)

    if (!user) {
      return res.status(200).json({ success: true, message: "If the email exists, a reset link has been sent" });
    }

    const token = generatePasswordToken();
    const tokenHash = createHash("sha256").update(token).digest("hex");

    // Expires after 24 hours
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const set_expire_and_token = await UserService.updateById(user._id, {
      token_expiry: tokenExpires,
      forgot_password_token: tokenHash
    })

    if (set_expire_and_token) {
      try {
        const email_info = forgotPasswordEmail(user, token);

        await sendEmail({
          to: user.email,
          subject: email_info.subject,
          text: email_info.text,
          html: email_info.html,
        });

      } catch (error) {
        console.log("Error in Email =>", error)
      }

    }

    return res.status(200).json({
      success: true,
      message: "If the email exists, a reset link has been sent"
    })


  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error in Forgoting Password" + error
    })
  }
}

export const updatePassword = async (req, res) => {
  try {

    const { confirmPassword, password, token } = req.body
    /**
     * 1. Fetch user with this token
     * 2. If any user exists, then check if the token is expiered
     * 3. If no user exsits then return error
     * 4. If user exists and token is not expired, then update password
     */
    if (!confirmPassword || !password || !token) {
      return res.status(400).json({
        success: false,
        message: "All Fiels required"
      })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password do not match "
      })
    }

    const tokenHash = createHash("sha256").update(token).digest("hex");
    const get_user = await UserService.getUserByToken(tokenHash)

    if (!get_user) {
      return res.status(400).json({
        success: false,
        message: "Error reseting Password"
      })
    }

    const is_token_expired = new Date(get_user.token_expiry) < new Date();


    if (!is_token_expired) {
      const hashedPassword = await encryptPassword(password);
      await UserService.updateById(
        get_user._id,
        {
          password: hashedPassword,
          token_expiry: null,
          forgot_password_token: null
        }
      )
      try {
        const email_info = passwordUpdatedEmail(get_user);
        await sendEmail({
          to: get_user.email,
          subject: email_info.subject,
          text: email_info.text,
          html: email_info.html,
        });
      } catch (error) {
        console.error("❌ Email sending failed:", error);
      }

      return res.status(200).json({
        success: true,
        message: "Password Updated.."
      })
    }
    else {
      return res.status(400).json({
        success: false,
        message: "Token Expired "
      })
    }


  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error reseting password: " + error
    })
  }
}
