import multer from "multer";
import upload from "../middleware/upload.middleware.js";
import {
  fetchAssignmentById,
  fetchAssignmentByProffesor,
  fetchAssignmentByStudent,
  uploadAssignment,
} from "./assignment.controller.js";
import { StudentGaurd } from "../middleware/gaurd.middleware.js";
import { Router } from "express";

const AssignmentRouter = Router();
AssignmentRouter.post(
  "/upload",
  StudentGaurd,
  upload.single("assignment"),
  (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          message: "File too large. Maximum allowed size is 10 MB.",
        });
      }
      return res.status(400).json({ message: err.message });
    }

    if (err) {
      return res.status(400).json({ message: err.message });
    }

    next();
  },
  uploadAssignment
);
AssignmentRouter.get("/byStudent", StudentGaurd, fetchAssignmentByStudent);

AssignmentRouter.get("/:id", fetchAssignmentById);

AssignmentRouter.get("/byProffesor", fetchAssignmentByProffesor);
export default AssignmentRouter;
