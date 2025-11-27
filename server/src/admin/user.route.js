import { Router } from "express";
import {  deleteUser, getAllUsers, getProffesor, getSession, login, logout, signup } from "./user.controller.js";
import { AdminGaurd, AdminStudentProfessorGaurd } from "../middleware/gaurd.middleware.js";

const UserRouter = Router() ; 


UserRouter.get("/session" , AdminStudentProfessorGaurd,getSession)
UserRouter.get("/allUsers",getAllUsers)
UserRouter.get("/proffesor",getProffesor) ;

UserRouter.post("/signup" , signup) ; 
UserRouter.post("/login" , login)  ; 
UserRouter.post("/logout",logout)
UserRouter.delete("/:id",AdminGaurd, deleteUser) ;


export default UserRouter ; 