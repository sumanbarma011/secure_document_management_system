import File from "../models/file.model.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import uploadToCloudinary from "../helper/cloudinary.upload.js";
export const upload = async (req, res) => {
  try {
    const uploadedFile = req.file;
    console.log(uploadedFile);

    if (!uploadedFile) {
      return res.status(400).json({
        message: "File not uploaded",
        success: false,
      });
    }
    const file = await File.create({
      owner: req.user.userId,
      filename: uploadedFile.filename,
      originalName: uploadedFile.originalname,
    });
    const result = await uploadToCloudinary(uploadedFile.path);
    return res.status(200).json({
      message: "File uploaded successfully",
      success: true,
      file,
      result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

//get all files
export const getFiles = async (req, res) => {
  try {
    const files = await File.find({
      $or: [{ owner: req.user.userId }, { sharedWith: req.user.userId }],
    });
    console.log(files);
    return res.status(200).json({ files, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
//shared file
export const shareFile = async (req, res) => {
  try {
    const { fileId, userId } = req.body;
    console.log(fileId, userId);
    const file = await File.findById(fileId);
    file.sharedWith.push(userId);
    await file.save();
    return res
      .status(200)
      .json({ message: "File shared", success: true, payload: file });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    const file = await File.findById(id);
    if (!file) {
      return res.status(404).json({
        message: "File not found",
        success: false,
      });
    }
    console.log(`file owner is ${typeof file.owner}`);
    console.log(`user id is  ${typeof req.user.userId}`);
    console.log(file);

    // check if owner or admin
    const isOwner = file.owner.toString() === req.user.userId;
    const isAdmin = req.user.role === "Admin";
    console.log(isOwner, isAdmin);

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "You are not authorized to delete this file",
        success: false,
      });
    }
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const filePath = path.join(__dirname, "../../src/uploads/", file.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await File.findByIdAndDelete(id);

    return res.status(200).json({
      message: "File deleted successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Delete failed",
      success: false,
    });
  }
};

export const download = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // find file in DB
    const file = await File.findById(id);
    if (!file) {
      return res.status(404).json({
        message: "File not found",
        success: false,
      });
    }

    // check if owner or shared with
    const isOwner = file.owner.toString() === userId.toString();
    const isShared = file.sharedWith?.includes(userId);

    if (!isOwner && !isShared) {
      return res.status(403).json({
        message: "You do not have access to this file",
        success: false,
      });
    }

    // build file path
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const filePath = path.join(__dirname, "../../src/uploads", file.filename);

    // check if file exists on disk
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        message: "File not found on server",
        success: false,
      });
    }

    // download file
    res.download(filePath, file.originalName, (err) => {
      if (err && !res.headersSent) {
        return res.status(500).json({
          message: "File download failed",
          success: false,
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Download failed",
      success: false,
    });
  }
};
