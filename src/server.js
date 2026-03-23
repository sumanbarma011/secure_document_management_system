import express from "express";
import dotenv from "dotenv";
import connection from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import fileRouter from "./routes/file.routes.js";
import adminRouter from "./routes/admin.routes.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;
app.get("/", (req, res) => {
  res.send("Hello");
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.use("/api/file", fileRouter);
app.use("/api/admin", adminRouter);
// database connection
connection();

app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`),
);
