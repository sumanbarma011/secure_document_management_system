import express from "express";
const router = express.Router();
import { register, logIn } from "../controllers/auth.controller.js";
router.post("/register", register);
router.post("/login", logIn);
export default router;
