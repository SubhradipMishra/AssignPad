import { Router } from "express";
import {
  createDepartment,
  findAllDepartment,
  findDepartmentById,
  findDepartmentByType,
  updateDepartment,
  deleteDepartment,
} from "./department.controller.js";

const DepartmentRouter = Router();

DepartmentRouter.get("/", findAllDepartment);
DepartmentRouter.get("/byId/:id", findDepartmentById);
DepartmentRouter.get("/byType/:type", findDepartmentByType);
DepartmentRouter.post("/", createDepartment);
DepartmentRouter.put("/:id", updateDepartment);
DepartmentRouter.delete("/:id", deleteDepartment);

export default DepartmentRouter;
