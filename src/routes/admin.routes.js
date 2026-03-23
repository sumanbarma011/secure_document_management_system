import express from "express";
import auth from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";
import { getAllUsers, getAllFiles } from "../controllers/admin.controller.js";
const router = express.Router();
router.get("/users", auth, adminMiddleware, getAllUsers);
router.get("/files", auth, adminMiddleware, getAllFiles);
export default router;
