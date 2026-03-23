import userModel from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(name, email, password);

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });
    return res.status(201).json({
      user: { _id: user._id, email: user.email, name: user.name },
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: `Server error is ${error}` });
  }
};
export const logIn = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(name, email, password);

    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid credentials...", success: false });
    }
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      res
        .status(400)
        .json({ message: "Password does not match", success: false });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.name, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    return res.status(201).json({
      message: "User logged in successfully",
      success: true,
      payload: {
        email: user.email,
        name: user.name,
        role: user.role,
        token: token,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "something went wrong",
      success: false,
    });
  }
};
