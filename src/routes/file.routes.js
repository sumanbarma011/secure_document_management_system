import express from "express";
const router = express.Router();
import auth from "../middlewares/auth.middleware.js";
import upload from "../middlewares/file.upload.middleware.js";
import {
  upload as uploadFile,
  getFiles,
  shareFile,
  destroy,
  download,
} from "../controllers/file.controller.js";

router.post("/upload", auth, upload.single("file"), uploadFile);

router.get("/", auth, getFiles);

router.post("/share", auth, shareFile);
router.delete("/destroy/:id", auth, destroy);
router.get("/download/:id", auth, download);
export default router;
