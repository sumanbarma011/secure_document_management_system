import mongoose from "mongoose";
import bcrypt from "bcrypt";
import userModel from "../models/user.model.js";
import "dotenv/config";
const admin_pass = process.env.ADMIN_PASSWORD || " ";
const connection = process.env.MONGODB_URI;
const createAdmin = async () => {
  try {
    await mongoose.connect(connection).then(async () => {
      const existingAdmin = await userModel.findOne({ role: "Admin" });
      if (existingAdmin) {
        console.log(" Admin already exists!");
        process.exit(0);
      }

      const hashedPassword = await bcrypt.hash(admin_pass, 10);

      await userModel.create({
        name: "Super Admin",
        email: "admin@gmail.com",
        password: hashedPassword,
        role: "Admin",
      });

      console.log(" Admin created successfully!");
      process.exit(0);
    });
  } catch (error) {
    console.log(error.message);
  }
};

createAdmin();
