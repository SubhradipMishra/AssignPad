import UserModel from "./user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer"

const FOURTEEN_MINUTES = 840000;
const SIX_DAYS = 518400000;

// Generate JWT tokens
const generateToken = (user) => {
  const payload = {
    id: user._id,
    fullname: user.fullname,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: FOURTEEN_MINUTES / 1000 });
  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: SIX_DAYS / 1000 });

  return { accessToken, refreshToken };
};


export const getSession = async (req, res) => {
  try {
    const session = req.user;
    return res.json(session);
  } catch (err) {
    console.log("Get Session error:", err);
    return res.status(500).json({ message: "Failed to get session" });
  }
};


const generateRandomPassword = (length = 8) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$&";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};


export const signup = async (req, res) => {
  try {
    const { fullname, email, role, phoneno, department } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists with this email!" });

    const defaultPassword = generateRandomPassword();

    
    const newUser = new UserModel({
      fullname,
      email,
      password: defaultPassword,
      role,
      phoneno,
      department,
    });

    await newUser.save();

  
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
  from: `"AssignPad Admin" <${process.env.SMTP_EMAIL}>`,
  to: email,
  subject: "Your Account Credentials for AssignPad",
  html: `
  <div style="font-family: Arial, sans-serif; background-color: #fff5f5; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border: 2px solid #ff4d4f; border-radius: 10px; overflow: hidden;">
      <div style="background-color: #ff4d4f; color: white; padding: 15px; text-align: center;">
        <h2 style="margin: 0;">AssignPad Admin</h2>
      </div>
      <div style="padding: 20px; color: #333;">
        <p>Hello <strong>${fullname}</strong>,</p>
        <p>Your account has been created successfully! Here are your login credentials:</p>
        <table style="width: 100%; margin-top: 15px; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; border: 1px solid #ff4d4f; font-weight: bold; width: 120px;">Email</td>
            <td style="padding: 10px; border: 1px solid #ff4d4f;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ff4d4f; font-weight: bold;">Password</td>
            <td style="padding: 10px; border: 1px solid #ff4d4f;">${defaultPassword}</td>
          </tr>
        </table>
        <p style="margin-top: 15px;">Please <strong>login and change your password</strong> within 24 hours for security purposes.</p>
        <p>Thank you,<br/><strong>AssignPad Team</strong></p>
      </div>
      <div style="background-color: #fff0f0; color: #ff4d4f; text-align: center; padding: 10px; font-size: 12px;">
        © ${new Date().getFullYear()} AssignPad. All rights reserved.
      </div>
    </div>
  </div>
  `,
};


    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log("Error sending email:", err);
        // optionally, you can still send back success message even if email fails
      } else {
        console.log("Email sent:", info.response);
      }
    });

    return res.json({
      message: "✅ User created successfully! Email sent with login credentials.",
      defaultPassword, // optional: send back default password for testing
    });
  } catch (err) {
    console.log("Signup Controller issue:", err);
    return res.status(500).json({ message: "❌ Failed to create user." });
  }
};

// Login controller
export const login = async (req, res) => {
  try {
    console.log(req.body);
  
    console.log(`🟢 Login attempt received: { email: '${req.body.email}' }`);

    const userFound = await UserModel.findOne({ email:req.body.email });
    if (!userFound) {
      console.log(`❌ User not found: `);
      return res.status(400).json({ message: "Invalid Credentials!" });
    }

    

    const isMatch = await bcrypt.compare(req.body.password, userFound.password);
    if (!isMatch) {
     
      return res.status(400).json({ message: "Invalid Credentials!" });
    }

    const { accessToken, refreshToken } = generateToken(userFound);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: FOURTEEN_MINUTES,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: SIX_DAYS,
    });

    console.log(`✅ Login successful `);

    return res.json({
      message: "Login successful!",
      user: {
        fullname: userFound.fullname,
        email: userFound.email,
        role: userFound.role,
      },
    });
  } catch (err) {
    console.error("🔥 Login Controller issue:", err);
    return res.status(500).json({ message: "Failed to login!" });
  }
};



// Logout controller
export const logout = async (req, res) => {
  try {
    res.clearCookie("accessToken", { httpOnly: true, sameSite: "strict" });
    res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict" });
    return res.json({ message: "Logout successful!" });
  } catch (err) {
    console.log("Logout Controller issue:", err);
    return res.status(500).json({ message: "Failed to logout!" });
  }
};

// Get all users (excluding admins)
export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({ role: { $ne: "admin" } });
    return res.status(200).json({ success: true, users });
  } catch (err) {
    console.log("Get all users error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch users." });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User not found." });

    return res.json({ message: "User deleted successfully." });
  } catch (err) {
    console.log("Delete user error:", err);
    return res.status(500).json({ message: "Failed to delete user." });
  }
};



export const getProffesor = async (req, res) => {
  try {
    const foundProfessors = await UserModel.find({ role: "professor" });

    const professors = foundProfessors.map((prof) => ({
      id: prof._id,
      name: prof.fullname,
      email: prof.email,
      phoneno: prof.phoneno,
      department: prof.department,
    }));

    return res.status(200).json({ professors });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch professors" });
  }
};