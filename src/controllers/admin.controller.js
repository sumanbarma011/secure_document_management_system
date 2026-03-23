import userModel from "../models/user.model.js";
import fileModel from "../models/file.model.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    return res.status(200).json({ users, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
export const getAllFiles = async (req, res) => {
  try {
    const files = await fileModel.find();
    return res.status(200).json({ files, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
