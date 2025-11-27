import multer from "multer";
import { uploadSingle, uploadMultiple } from "../middleware/upload.middleware.js";
import {
  fetchAssignmentById,
  fetchAssignmentByProffesor,
  fetchAssignmentByStudent,
  uploadAssignmentSingle,
  uploadAssignmentBulk,
} from "./assignment.controller.js";
import { StudentGaurd } from "../middleware/gaurd.middleware.js";
import { Router } from "express";

const AssignmentRouter = Router();

AssignmentRouter.post(
  "/upload",
  StudentGaurd,
  uploadSingle,
  (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "File too large. Max 10MB." });
      }
      return res.status(400).json({ message: err.message });
    }
    if (err) return res.status(400).json({ message: err.message });
    next();
  },
  uploadAssignmentSingle
);

AssignmentRouter.post(
  "/upload-multiple",
  StudentGaurd,
  uploadMultiple,
  uploadAssignmentBulk
);

AssignmentRouter.get("/byStudent", StudentGaurd, fetchAssignmentByStudent);
AssignmentRouter.get("/byProffesor", fetchAssignmentByProffesor);
AssignmentRouter.get("/:id", fetchAssignmentById);

export default AssignmentRouter;
