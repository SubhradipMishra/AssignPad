import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";
import { fileURLToPath } from "url";

import multer from  "multer"
import DepartmentRouter from "./department/department.route.js";
import UserRouter from "./admin/user.route.js";
import AssignmentRouter from "./assignment/assignment.route.js";


dotenv.config();

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("✅ DB Connected Successfully..."))
  .catch((err) => console.log("❌ DB failed to connect:", err.message));

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const folder_path = path.join(__dirname , "storage");

console.log(folder_path);
app.use(express.static(folder_path)) ;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.originalUrl}`);
  next();
});




app.use("/auth",UserRouter);

app.use("/department",DepartmentRouter)

app.use("/assignment",AssignmentRouter) ;

app.listen(4040, () => console.log("🚀 Server running on port 4040"));
